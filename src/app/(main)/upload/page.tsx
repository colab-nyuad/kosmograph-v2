"use client";
import CustomCard from "@/components/global/custom-card";
import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const UploadPage = () => {
	const [selectedFile, setSelectedFile] = React.useState<
		string | ArrayBuffer | null
	>();
	const [fileName, setFileName] = React.useState<string | null>();
	const [numRecords, setNumRecords] = React.useState<number | null>();
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.target?.files?.[0];
		setFileName(file?.name);
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
				<div className="absolute top-0 left-0 font-bold text-3xl m-3">
					Kosmograph
				</div>
				<div className="flex flex-col">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						{" "}
						<Link
							href="/"
							className="text-sm opacity-80 dark:text-muted hover:opacity-90"
						>
							{"<-back to home"}
						</Link>
						{/* Card to display content of the file */}
						<div className={clsx("", { hidden: selectedFile })}>
							<UIInput
								id="file"
								type="file"
								accept="tsv,.csv"
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
										<Link href="/dashboard">Launch</Link>
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
