"use client";
import CustomCard from "@/components/global/custom-card";
import BackToHome from "@/components/kosmograph/backToHome";
import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { writeFile } from "fs/promises";
import Link from "next/link";
import { join } from "path";
import React from "react";
import { useAtom } from "jotai";
import { fileNameAtom } from "@/components/kosmograph/atoms/store";

const UploadPage = () => {
	const [selectedFile, setSelectedFile] = React.useState<
		string | ArrayBuffer | null
	>();
	const [fileName, setFileName] = React.useState<string | null>();
	const [numRecords, setNumRecords] = React.useState<number | null>();
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [fName, setfName] = useAtom(fileNameAtom);
	
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.target?.files?.[0];
		setFileName(file?.name);
		let fileNameHelper=file?.name.toString()
		//@ts-ignore
		setfName(fileNameHelper);

		if (!file) return;

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const text = reader.result?.toString().match(/\r?\n/g);
				setNumRecords((text?.length ?? 0) - 1); // Subtract header line
				setSelectedFile(reader.result);
			};
			reader.readAsText(file);
		}

		// Create a FormData object and append the file
		const formData = new FormData();
		formData.set("file", file);
		// Send the file to the /api/upload endpoint
		try {
			const response = await fetch("/kosmograph/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				setSelectedFile("");
				throw new Error("File upload failed");
			}

			const result = await response.json();
			console.log("File uploaded successfully:", result);
		} catch (error) {
			setSelectedFile("");
			console.error("Error uploading file:", error);
		}
	};

	return (
		<>
			<div
				className="bg-background h-screen
				flex
				justify-center
				items-center
				gap-4 dark:text-white"
			>
				<div className="flex flex-col">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						{" "}
						<BackToHome />
						{/* Card to display content of the file */}
						<div className={clsx("", { hidden: selectedFile })}>
							<UIInput
								id="file"
								type="file"
								accept="tsv,.csv,.txt"
								onChange={handleFileChange}
								className={clsx("text-center border-dashed sm:px-20 sm:py-20", {
									hidden: selectedFile,
								})}
								// create a ref to click this input from the button
								ref={fileInputRef}
							/>
							<div>
								<div className="mt-3 text-bold text-xl">Graph Data</div>
								<br />
								<div className="max-w-sm">
									File that contains a list of graph edges records. It must have
									three columns representing head, relation and tail.
									<br />
									<br />
									Supported formats: .csv, .tsv
								</div>
							</div>
						</div>
						{selectedFile && (
							<>
								<CustomCard
									cardHeader={
										<div className="flex items-center justify-between space-x-4 rounded-md border p-4">
											<CardTitle className="text-sm">{fileName}</CardTitle>
											<CardDescription>{`${numRecords} Records`}</CardDescription>
										</div>
									}
									cardFooter={
										<div className="flex items-center justify-center space-x-32">
											<Button
												onClick={() => {
													fileInputRef?.current?.click();
												}}
												variant="ghost"
											>
												Replace File
											</Button>
											<Button
												onClick={() => {
													fileInputRef.current &&
														(fileInputRef.current.value = "");
													setSelectedFile(null);
												}}
												variant="destructive"
											>
												Remove
											</Button>
										</div>
									}
								/>
								<div>
									<Button className="w-full bg-primary font-bold" asChild>
										<Link href={`/kosmograph/dashboard?file=${fileName}`}>
											Launch
										</Link>
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default UploadPage;

const Input = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input ref={ref} {...props} />);

Input.displayName = "Input";
