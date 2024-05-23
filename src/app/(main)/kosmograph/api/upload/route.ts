import { writeFile } from "fs/promises";
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

    // Parse the CSV content
    const csvContent = buffer.toString();
    const records = parse(csvContent, {
        columns: ['subject', 'predicate', 'object'],
        skip_empty_lines: true
    });

    // Save the parsed data to a JSON file in the public directory
    const path = join(process.cwd(), "public", "data", 'uploadFile.json');

    await writeFile(path, JSON.stringify(records, null, 2));

    return NextResponse.json({ success: true, data: records });
}

