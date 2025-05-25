import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { parse } from 'csv-parse/sync';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded." });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = file.name;
    console.log("Processing file:", fileName);
    let records;
    const genericParsingErrorMessage = "Failed to parse the uploaded file. Please ensure it is a valid CSV, TSV, or TXT file with three columns.";

    try {
        if (fileName.endsWith(".csv")) {
            const csvContent = buffer.toString();
            records = parse(csvContent, {
                columns: ['subject', 'predicate', 'object'],
                delimiter: ',',
                skip_empty_lines: true
            });
        } else if (fileName.endsWith(".tsv")) {
            const tsvContent = buffer.toString();
            records = parse(tsvContent, {
                columns: ['subject', 'predicate', 'object'],
                delimiter: '\t',
                skip_empty_lines: true
            });
        } else if (fileName.endsWith(".txt")) {
            const textContent = buffer.toString();
            const lines = textContent.split('\n').slice(0, 10); // Analyze first 10 lines
            let commaCount = 0;
            let tabCount = 0;

            for (const line of lines) {
                if (line.includes(',')) commaCount++;
                if (line.includes('\t')) tabCount++;
            }

            let delimiter;
            if (tabCount > commaCount && tabCount > 0) { // Prioritize tab if counts are close but tab exists
                delimiter = '\t';
            } else if (commaCount > 0) {
                delimiter = ',';
            } else {
                // If still unsure, check more lines or default, here we error
                if (textContent.split('\n').length > 10) { // Check if there are more lines to analyze
                     const moreLines = textContent.split('\n').slice(10, 20); // Analyze next 10 lines
                     for (const line of moreLines) {
                        if (line.includes(',')) commaCount++;
                        if (line.includes('\t')) tabCount++;
                     }
                     if (tabCount > commaCount && tabCount > 0) {
                         delimiter = '\t';
                     } else if (commaCount > 0) {
                         delimiter = ',';
                     } else {
                        return NextResponse.json({ success: false, message: "Could not determine delimiter for TXT file. Please use comma or tab." });
                     }
                } else {
                     return NextResponse.json({ success: false, message: "Could not determine delimiter for TXT file. Please use comma or tab." });
                }
            }
            
            console.log("Detected delimiter for TXT:", delimiter);
            records = parse(textContent, {
                columns: ['subject', 'predicate', 'object'],
                delimiter: delimiter,
                skip_empty_lines: true
            });
        } else {
            return NextResponse.json({ success: false, message: "Unsupported file type. Please upload a CSV, TSV, or TXT file." });
        }

        // Handle header row: Check if the first row is a header
        if (records && records.length > 0) {
            const firstRecord = records[0];
            if (
                firstRecord.subject === 'subject' &&
                firstRecord.predicate === 'predicate' &&
                firstRecord.object === 'object'
            ) {
                records.shift(); // Remove header row
                console.log("Header row detected and skipped.");
            }
        }

    } catch (error) {
        console.error("Parsing error:", error);
        return NextResponse.json({ success: false, message: genericParsingErrorMessage });
    }

    if (!records || records.length === 0) {
        return NextResponse.json({ success: false, message: "No data found in the file or file is empty after processing." });
    }

    // Save the parsed data to a JSON file in the public directory
    const path = join(process.cwd(), "public", "data", 'uploadFile.json');
    try {
        await writeFile(path, JSON.stringify(records, null, 2));
    } catch (error) {
        console.error("Error writing file:", error);
        return NextResponse.json({ success: false, message: "Failed to save processed data." });
    }
    
    // Read the latest data from the saved file to ensure it's up-to-date
    // This step might be redundant if the 'records' variable is already the source of truth.
    // However, it ensures that what's returned is exactly what was written.
    try {
        const latestData = JSON.parse(await readFile(path, 'utf-8'));
        console.log("Data saved successfully:", latestData);
        return NextResponse.json({ success: true, data: latestData });
    } catch (error) {
        console.error("Error reading back saved file:", error);
        return NextResponse.json({ success: false, message: "Failed to confirm saved data." });
    }
}
}
