"use client";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const QueryPage = () => {
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
		await new Promise((resolve) => setTimeout(resolve, 5000));
		// post the data to the api
		// const res = await fetch("/api/query", {
		// 	method: "POST",
		// 	body: JSON.stringify(data),
		// });
		// const result = await res.json();
		// // redirect to the result page
		// router.push(`/result/${result.fileName}`);
		router.replace("/dashboard");
	};
	return (
		<div
			className="bg-background h-screen
			flex
			justify-center
			items-center
			gap-4 dark:text-white"
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					// className="w-1/3 space-y-6"
					className="grid w-full max-w-sm items-center gap-1.5"
				>
					<FormField
						control={form.control}
						disabled={isLoading}
						name="query"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<Link
									href="/"
									className="text-sm opacity-80 dark:text-muted hover:opacity-90"
								>
									{"<-back to home"}
								</Link>
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
										endpoint for visualization. The query returns a list of json
										entries that contain triples.
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
		</div>
	);
};

export default QueryPage;
