//@ts-nocheck
"use client";

//@ts-nocheck
"use client";

import CustomCard from "@/components/global/custom-card";
import BackToHome from "@/components/kosmograph/backToHome";
import UploadError from "@/components/kosmograph/uploadError"; // Import UploadError
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
	const [uploadErrorMsg, setUploadErrorMsg] = React.useState<string | null>(
		null,
	); // State for error messages
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setUploadErrorMsg(null); // Clear previous error messages
		const file = e?.target?.files?.[0];
		

		if (!file) {
			// If no file is selected (e.g., user cancels file dialog)
			// Do not set an error message here, as it might be confusing.
			// Only set error if they try to proceed or if backend fails.
			// Resetting file name and selected file if they cancel.
			setFileName(null);
			setSelectedFile(null);
			setNumRecords(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = ""; // Clear the file input
			}
			return;
		}
		
		setFileName(file?.name);


		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const text = reader.result?.toString().match(/\r?\n/g);
				// Assuming header is always present for this calculation
				setNumRecords((text?.length ?? 0)); 
				setSelectedFile(reader.result); // Keep this to show the card preview
			};
			reader.readAsText(file);
		}

		const formData = new FormData();
		formData.set("file", file);

		try {
			const response = await fetch("/kosmograph/api/upload", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				const errorMsg = result.message || "File upload failed. Please check the file format and try again.";
				setUploadErrorMsg(errorMsg);
				setSelectedFile(null); // Clear preview on error
				setFileName(null);
				setNumRecords(null);
				if (fileInputRef.current) {
					fileInputRef.current.value = ""; // Clear the file input
				}
				console.error("File upload error:", errorMsg);
				return; // Stop execution
			}
			
			// Success case
			setUploadErrorMsg(null); // Clear any previous errors
			setNumRecords(result.data.length); // Update numRecords with actual parsed data length
			console.log("File uploaded successfully:", result);
			// setSelectedFile is already set for preview, fileName is also set.
		} catch (error) {
			console.error("Error uploading file:", error);
			setUploadErrorMsg("An unexpected error occurred during file upload. Please try again.");
			setSelectedFile(null); // Clear preview on error
			setFileName(null);
			setNumRecords(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = ""; // Clear the file input
			}
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		setFileName(null);
		setNumRecords(null);
		setUploadErrorMsg(null); // Clear any errors
		if (fileInputRef.current) {
			fileInputRef.current.value = ""; // Clear the file input so the same file can be re-uploaded
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
						{/* Display Upload Error */}
						{uploadErrorMsg && <UploadError message={uploadErrorMsg} />}
						{/* Card to display content of the file */}
						<div className={clsx("", { hidden: selectedFile && !uploadErrorMsg})}>
							<UIInput
								id="file"
								type="file"
								accept=".tsv,.csv,.txt" // Ensure .txt is accepted
								onChange={handleFileChange}
								className={clsx("text-center border-dashed sm:px-20 sm:py-20", {
									// Keep input hidden if a file is selected AND there's no error
									hidden: selectedFile && !uploadErrorMsg,
								})}
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
									Supported formats: .csv, .tsv, .txt
								</div>
							</div>
						</div>
						{selectedFile && !uploadErrorMsg && ( // Only show card if no error
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
													// Clear error before triggering file input
													setUploadErrorMsg(null);
													fileInputRef?.current?.click();
												}}
												variant="ghost"
											>
												Replace File
											</Button>
											<Button
												onClick={handleRemoveFile}
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
