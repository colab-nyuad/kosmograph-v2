import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { parse } from 'csv-parse/sync';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine the file type based on the file name or content
    const fileName = file.name;
    console.log("Processing file:", fileName);
    let records;

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
    
        // Detect the delimiter (either ',' or '\t')
        const firstLine = textContent.split('\n')[0];
        const delimiter = firstLine.includes('\t') ? '\t' : ',';
    
        // Parse the content using the detected delimiter
        records = parse(textContent, {
            columns: ['subject', 'predicate', 'object'],
            delimiter: delimiter,
            skip_empty_lines: true
        });
    } else {
        return NextResponse.json({ success: false, message: "Unsupported file type" });
    }

    // Save the parsed data to a JSON file in the public directory
    const path = join(process.cwd(), "public", "data", 'uploadFile.json');
    await writeFile(path, JSON.stringify(records, null, 2));

    // Read the latest data from the saved file to ensure it's up-to-date
    console.log(path);
   
    const latestData = JSON.parse(await readFile(path, 'utf-8'));
    console.log("Data saved successfully:", latestData);
    return NextResponse.json({ success: true, data: latestData });
}
