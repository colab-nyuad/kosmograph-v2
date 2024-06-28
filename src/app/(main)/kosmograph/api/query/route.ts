import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    console.log("Received query:", query);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const queryUrl = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(query)}&format=json`;
    const headers = {
      Accept: "application/json",
      "User-Agent": "CityGraph",
    };

    console.log("Fetching data from URL:", queryUrl);
    const response = await fetch(queryUrl, { method: "GET", headers });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Received data from query:", JSON.stringify(result, null, 2));

    const filename = `query${Math.floor(Math.random() * 100)}.csv`;
    const dirPath = join(process.cwd(), "data");
    const filePath = join(dirPath, filename);

    // Ensure the data directory exists
    await mkdir(dirPath, { recursive: true });

    let fileData = "s,p,o\n";
    let count = 0;

    result.results.bindings.forEach((item: any) => {
      let num = 0;
      for (const [_, value] of Object.entries(item)) {
        if (num == 2) {
          fileData += (value as { value: string }).value + "\n";
          num = 0;
          count++;
        } else {
          fileData += (value as { value: string }).value + ",";
          num++;
        }
      }
    });

    console.log("Writing data to file:", filePath);
    await writeFile(filePath, fileData);
    console.log("File written successfully");

    console.log("Returning response:", { fileName: filename, count: count });
    return NextResponse.json({
      fileName: filename,
      count: count,
    });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 });
  }
}