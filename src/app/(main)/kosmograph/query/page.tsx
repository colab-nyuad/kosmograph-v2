"use client";
import CustomCard from "@/components/global/custom-card";
import BackToHome from "@/components/kosmograph/backToHome";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { QueryFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { writeFile } from "fs/promises";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const QueryPage = () => {
	const [fileName, setFileName] = React.useState<string | null>();
	const [numRecords, setNumRecords] = React.useState<number | null>();

	const router = useRouter();
	// defining the form with zod
	const form = useForm<z.infer<typeof QueryFormSchema>>({
		mode: "onChange",
		resolver: zodResolver(QueryFormSchema),
	});
	const isLoading = form.formState.isSubmitting;

	// submit function
	const onSubmit = async (data: z.infer<typeof QueryFormSchema>) => {
		console.log(data);
		// sleep for 30 seconds
		await new Promise((resolve) => setTimeout(resolve, 500));
		// post the data to the api
		const res = await fetch("/kosmograph/api/query", {
			method: "POST",
			body: JSON.stringify(data),
		});

		const result = await res.json();
		setFileName(result.fileName);
		setNumRecords(result?.count ?? 0);
		// // redirect to the result page
		// router.push(`/result/${result.fileName}`);
	};
	return (
		<div
			className="bg-background h-screen
			flex
			justify-center
			items-center
			gap-4 dark:text-white"
		>
			<div className="flex flex-col">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className={clsx("grid w-full max-w-sm items-center gap-1.5", {
							hidden: fileName,
						})}
					>
						<FormField
							control={form.control}
							disabled={isLoading}
							name="query"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<BackToHome />
									<FormLabel className="text-xl">SPARQL QUERY</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Write Your Sparql Query Here"
											className="resize-none tracking-tight"
											{...field}
										/>
									</FormControl>
									<div className="pt-4 pb-3">
										<FormDescription className="font-semibold text-l text-pretty">
											Write a sparql query to fetch data from citygraph sparql
											endpoint for visualization. The query returns a list of
											json entries that contain triples.
										</FormDescription>
									</div>

									<FormMessage />
								</FormItem>
							)}
						/>
						{isLoading ? (
							<Button disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button type="submit">Submit</Button>
						)}
					</form>
				</Form>
				{fileName && (
					<>
						<BackToHome />
						<CustomCard
							cardHeader={
								<div className="flex items-center justify-between space-x-4 rounded-md border p-4">
									<CardTitle className="text-sm">{fileName}</CardTitle>
									<CardDescription>{`${numRecords} Records`}</CardDescription>
								</div>
							}
							cardFooter={
								<div className="flex w-full items-center justify-center space-x-32">
									<Button
										onClick={() => {
											setFileName("");
											setNumRecords(0);
										}}
										variant="secondary"
										className="w-full"
									>
										New Query
									</Button>
								</div>
							}
						/>
						<div>
							<Button className="w-full bg-primary font-bold mt-4" asChild>
								<Link href={`/kosmograph/dashboard?file=${fileName}`}>
									Launch
								</Link>
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default QueryPage;
