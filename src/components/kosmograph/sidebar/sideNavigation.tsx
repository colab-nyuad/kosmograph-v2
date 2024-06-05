"use client";

import clsx from "clsx";
import {
	ArrowLeftToLine,
	ArrowRightFromLine,
	Minimize,
	MousePointerSquareDashed,
} from "lucide-react";

import * as React from "react";

import { Button } from "../../ui/button";
import { DisplayGraph } from "../graphDemoSigma";
import GraphViz from "../graphViz";
import SidebarTabs from "./sidebarTabs";

export default function Dashboard({ file }: { file: string }) {
	const [sidebarOpen, setSidebarOpen] = React.useState(false);
	const cosmographRef = React.useRef(null);

	const fitView = () => (cosmographRef.current as any)?.fitView();
	const resetViewOnSidebarChange = () => {
		setSidebarOpen(!sidebarOpen);
		(cosmographRef.current as any)?.fitView();
		let zoomLevel = (cosmographRef.current as any)?.getZoomLevel();
		(cosmographRef.current as any)?.setZoomLevel(zoomLevel, 250);
	};
	const setZoomLevel = () =>
		(cosmographRef.current as any)?.setZoomLevel(162, 250);
	return (
		<div className="flex">
			<div
				className={clsx(
					"flex flex-col h-screen p-1 bg-gray-100 dark:bg-brand-sidebar text-brand-dark dark:text-white shadow z-10 transition-width transition-scale duration-300 ease-in-out",
					{
						"transform scale-x-0 w-0": sidebarOpen,
						"transform scale-x-100 w-72": !sidebarOpen,
					}
				)}
			>
				<div className="space-y-3 p-2 overflow-auto h-full">
					<SidebarTabs />
				</div>
			</div>

			<div>
				<div className="flex-1 relative">
					{" "}
					<div className="absolute top-0 left-0 p-2 flex flex-col space-y-1 z-40">
						<Button
							onClick={resetViewOnSidebarChange}
							variant="ghost"
							size="sm"
						>
							{!sidebarOpen ? (
								<ArrowLeftToLine className="w-4 h-4" />
							) : (
								<ArrowRightFromLine className="w-4 h-4" />
							)}
						</Button>
						<Button
							onClick={() =>
								setZoomLevel() ||
								console.log(
									"zoom level: ",
									(cosmographRef.current as any)?.getZoomLevel()
								)
							}
							variant="ghost"
							size="sm"
						>
							<MousePointerSquareDashed className="w-4 h-4" />
						</Button>
						<Button onClick={() => fitView()} variant="ghost" size="sm">
							<Minimize className="w-4 h-4" />
						</Button>
					</div>
					{/* Graph component */}
					{/* <div className="absolute inset-1">
						{" "}
						<DisplayGraph />
					</div> */}
					<div className="absolute inset-1">
						{" "}
						<GraphViz cosmographRef={cosmographRef} sidebarOpen={sidebarOpen} />
					</div>
				</div>
			</div>
		</div>
	);
}
