"use client";

import clsx from "clsx";
import {
	ArrowLeftToLine,
	ArrowRightFromLine,
	Minimize,
	MousePointerSquareDashed,
} from "lucide-react";

import * as React from "react";

import { Button } from "../ui/button";
import { DisplayGraph } from "./graphDemoSigma";
import SidebarTabs from "./sidebarTabs";

export default function Dashboard({ file }: { file: string }) {
	const [open, setOpen] = React.useState(false);
	console.log(file);
	return (
		<div className="flex">
			<div
				className={clsx(
					"flex flex-col h-screen p-1 bg-gray-100 dark:bg-brand-sidebar text-brand-dark dark:text-white shadow z-10 transition-width transition-scale duration-300 ease-in-out",
					{
						"transform scale-x-0 w-0": open,
						"transform scale-x-100 w-72": !open,
					}
				)}
			>
				<div className="space-y-3 p-2">
					<SidebarTabs />
				</div>
			</div>

			<div>
				<div className="flex-1 relative">
					{" "}
					<div className="absolute top-0 left-0 p-2 flex flex-col space-y-1 z-40">
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							{!open ? (
								<ArrowLeftToLine className="w-4 h-4" />
							) : (
								<ArrowRightFromLine className="w-4 h-4" />
							)}
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<MousePointerSquareDashed className="w-4 h-4" />
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<Minimize className="w-4 h-4" />
						</Button>
					</div>
					{/* Graph component */}
					<div className="absolute inset-1"> {/* <DisplayGraph /> */}</div>
				</div>
			</div>
		</div>
	);
}
