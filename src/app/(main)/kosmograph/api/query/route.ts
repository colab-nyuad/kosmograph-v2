import { writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { query } = req.body;

      if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
      }

      const queryUrl = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(query)}&format=json`;
      const headers = {
        Accept: "application/json",
        "User-Agent": "CityGraph",
        "Access-Control-Allow-Origin": "*",
      };

      const response = await fetch(queryUrl, { method: "GET", headers });

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }

      const result = await response.json();

      const filename = `query${Math.floor(Math.random() * 100)}.csv`;
      const filePath = join(process.cwd(), "data", filename);

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

      await writeFile(filePath, fileData);

      res.status(200).json({
        fileName: filename,
        count: count,
      });
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
	//@ts-expect-error
    res.status(500).json({ error: error.message });
  }
}
