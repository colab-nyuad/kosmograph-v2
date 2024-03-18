import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const HomePage = () => {
	return (
		<>
			<div className="h-screen flex flex-col items-center justify-center">
				<div
					className="bg-background 
                 gap-4 dark:text-white
                 flex items-center justify-center 
                    pt-1 
                    pb-8
                    text-4xl font-bold"
				>
					Kosmograph
				</div>
				<div className="h-32"></div>
				<div className="flex item-center justify-center">
					<div className="flex flex-col justify-center items-center gap-10 sm:flex-row">
						<Link href="/kosmograph/upload">
							<Card className="sm:w-[500px] h-40 bg-white dark:bg-brand-dark dark:text-white hover:scale-110 opacity-80 transition duration-300 ease-in-out hover:opacity-100">
								<CardHeader className="flex items-center justify-center">
									<CardTitle>File Upload Mode</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										File that contains a list of graph edges records. It must
										have three columns representing head, relation and
										tail.Supported formats: .csv, .tsv
									</p>
								</CardContent>
							</Card>
						</Link>
						<Link href="/kosmograph/query">
							<Card className="sm:w-[500px] h-40 bg-white dark:bg-brand-dark dark:text-white hover:scale-110 opacity-80 transition duration-300 ease-in-out hover:opacity-100">
								<CardHeader className="flex items-center justify-center">
									<CardTitle>Query Mode</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Write a sparql query to fetch data from citygraph sparql
										endpoint for visualization. The query returns a list of
										jsons that contain triples.
									</p>
								</CardContent>
							</Card>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
