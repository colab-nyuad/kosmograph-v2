"use client";
import Header from "@/components/kosmograph/header";
import Dashboard from "@/components/kosmograph/sideNavigation";
import UploadError from "@/components/kosmograph/uploadError";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const DashboardPage = () => {
	// get the query string with file name
	const searchParams = useSearchParams();
	const search: string | null = searchParams.get("file");

	return (
		<>
			{search ? (
				<Dashboard file={search} />
			) : (
				<div className="flex flex-col items-center justify-center w-screen h-screen">
					<Header />
					<UploadError />
					<Link href="/kosmograph">
						<Button variant="outline" className="border-2 my-3">
							<ChevronLeft className="h-4 w-4" /> Back Home
						</Button>
					</Link>
				</div>
			)}
		</>
	);
};

export default DashboardPage;
