import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	//get text area data
	const query = await request.json();

	console.log(query);
	const queryUrl =
		"https://query.citygraph.co/proxy/wdqs/bigdata/namespace/wdq/sparql?query=" +
		encodeURIComponent(query.data) +
		"&format=json";

	const headers = {
		Accept: "application/json",
		"User-Agent": "CityGraph",
		"Access-Control-Allow-Origin": "*",
	};

	//fetch data from url
	const res = await fetch(queryUrl, {
		method: "GET",
		headers: headers,
	});

	const result = await res.json();

	// filename is query + random number + .csv
	const filename = "query" + Math.floor(Math.random() * 100) + ".csv";

	const filePath = join(process.cwd(), filename);

	let fileData = "s,p,o\n";

	//   loop through results and get the data from value key
	const data = result.results.bindings.map((item: any) => {
		let num = 0;
		for (const [_, value] of Object.entries(item)) {
			// write the value key to the file in format s,p,o
			if (num == 2) {
				fileData += (value as { value: string }).value + "\n";
				num = 0;
			} else {
				fileData += (value as { value: string }).value + ",";
				num++;
			}
		}
	});

	console.log(fileData, filePath);
	// write the file
	await writeFile(filePath, fileData);

	return NextResponse.json({
		fileName: filename,
	});
}
