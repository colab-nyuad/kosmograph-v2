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
					CityGraph Tools
				</div>
				<div className="h-32"></div>
				<div className="flex item-center justify-center">
					<div className="flex flex-col justify-center items-center gap-10 sm:flex-row">
						<Link href="/kosmograph">
							<Card className="sm:w-[500px] h-40 bg-white dark:bg-brand-dark dark:text-white hover:scale-110 opacity-80 transition duration-300 ease-in-out hover:opacity-100">
								<CardHeader className="flex items-center justify-center">
									<CardTitle>Kosmograph</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Tool for visualizing knowledge Graphs.Supported formats:
										.csv, .tsv, .txt
									</p>
								</CardContent>
							</Card>
						</Link>
						<Link href="#">
							<Card className="sm:w-[500px] h-40 bg-white dark:bg-brand-dark dark:text-white hover:scale-110 opacity-80 transition duration-300 ease-in-out hover:opacity-100">
								<CardHeader className="flex items-center justify-center">
									<CardTitle>Wiki Data Text Query</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Generate Sparql queries with natural language</p>
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
