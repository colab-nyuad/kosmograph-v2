import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import Link from "next/link";
import React, { useState } from "react";
import { Accordion } from "../../ui/accordion";
import {
	activeTabAtom,
	globalGraphAtom,
	selectedNodeAtom,
	isHistoryEnabledAtom,
} from "../atoms/store";
import { LinkTypes } from "../linkTypes";
import SidebarLinkTab from "./sidebarLinkTab";
import SidebarNodeTab from "./sidebarNodeTab";
import { Button } from "@/components/ui/button";
import { kHopValueAtom, isKHopEnabledAtom } from "../atoms/store";

// const SidebarTabs = () => {
// 	const [activeTab, setActiveTab] = useAtom(activeTabAtom);
// 	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
// 	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);

// 	const [isHistoryEnabled, setIsHistoryEnabled] = useAtom(
// 		isHistoryEnabledAtom
// 	);

// 	const [kHopValue, setKHopValue] = useAtom(kHopValueAtom);
// 	const [isKHopEnabled, setIsKHopEnabled] = useAtom(isKHopEnabledAtom);
// 	const [tempKValue, setTempKValue] = useState("1");
  
// 	const handleKHopToggle = () => {
// 	  setIsKHopEnabled(!isKHopEnabled);
// 	};
  
// 	const handleKValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 	  const value = parseInt(e.target.value);
// 	  if (!isNaN(value) && value > 0) {
// 		setTempKValue(e.target.value);
// 		setKHopValue(value);
// 	  }
// 	};

// 	// Pass this function to the node click even to navigate to the info tab
// 	const navigateToTab = (tabValue: React.SetStateAction<string>) => {
// 		setActiveTab(tabValue);
// 	};

// 	const handleHistoryToggle = () => {
		
// 		setIsHistoryEnabled(!isHistoryEnabled);
// 		console.log("History enabled:", !isHistoryEnabled);
	
// 	};
	

// 	return (
// 		<Tabs value={activeTab} onValueChange={setActiveTab}>
// 			<Link href="/kosmograph">
// 				<span className="text-m font-bold pr-3">KG</span>
// 			</Link>
// 			<TabsList>
// 				<TabsTrigger value="general">General</TabsTrigger>
// 				<TabsTrigger value="info">Info</TabsTrigger>
// 				<TabsTrigger value="explore">Explore</TabsTrigger>
// 			</TabsList>
// 			<TabsContent value="general">
// 				<div className="flex-1">
// 					<div className="pt-2 pb-4 space-y-1 text-sm">
// 						<Accordion type="multiple">
// 							<SidebarNodeTab />
// 							<SidebarLinkTab />
// 							<LinkTypes />
// 						</Accordion>
// 					</div>
// 				</div>
// 			</TabsContent>
// 			<TabsContent value="info">
// 				{globalGraph ? (
// 					<>
// 						<div className="flex flex-row items-center justify-left mt-6">
// 							<span className="text-l pr-3 text-slate-700 dark:text-slate-400">
// 								Nodes: {globalGraph.nodes().length}
// 							</span>
// 							<span className="text-l text-slate-700 dark:text-slate-400">
// 								Links: {globalGraph.edges().length}
// 							</span>
// 						</div>
// 						<Separator className="h-[3px] mt-3" />
// 						<div>
// 							{selectedNode && (
// 								<div className="flex flex-col mt-3">
// 									<div className="text-wrap break-all">{selectedNode.id}</div>
// 									<div className="text-xs mb-3 text-slate-600 dark:text-slate-300">
// 										Selected Node
// 									</div>
// 									<div className="flex flex-row items-center justify-left">
// 										<div className="flex-col pr-3 mt-3">
// 											<div>{selectedNode.indegree}</div>
// 											<div className="text-xs text-slate-600 dark:text-slate-300">
// 												Out Degree
// 											</div>
// 										</div>

// 										<div className="flex-col mt-3">
// 											<div>{selectedNode.outdegree}</div>
// 											<div className="text-xs text-slate-600 dark:text-slate-300">
// 												In Degree
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							)}
// 						</div>
// 					</>
// 				) : (
// 					<div>Graph not loaded properly!</div>
// 				)}
// 			</TabsContent>
// 			<TabsContent
// 				value="explore"
// 				className="flex flex-col items-center justify-center"
// 			>
// 				<div className="flex items-center mt-4">
// 					<span className="pr-3 text-slate-700 dark:text-slate-400">
// 						History
// 					</span>
// 					<button
// 						type="button"
// 						role="switch"
// 						aria-checked={isHistoryEnabled}
// 						data-state={isHistoryEnabled ? true: false}
// 						className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isHistoryEnabled ? "bg-primary" : "bg-input"}`}
// 						//@ts-ignore
// 						onClick={(event) => handleHistoryToggle()}
// 					>
// 						<span
// 							className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isHistoryEnabled ? "translate-x-5" : "translate-x-0"}`}
// 						></span>
// 					</button>
// 				</div>
				
// 			</TabsContent>
// 		</Tabs>
// 	);
// };

//sidebar tabs with k-hops neighbour map visualisation
const SidebarTabs = () => {
	const [activeTab, setActiveTab] = useAtom(activeTabAtom);
	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);
	const [isHistoryEnabled, setIsHistoryEnabled] = useAtom(isHistoryEnabledAtom);
	const [kHopValue, setKHopValue] = useAtom(kHopValueAtom);
	const [isKHopEnabled, setIsKHopEnabled] = useAtom(isKHopEnabledAtom);
	const [tempKValue, setTempKValue] = useState("1");

	const navigateToTab = (tabValue: React.SetStateAction<string>) => {
		setActiveTab(tabValue);
	};

	const handleHistoryToggle = () => {
		setIsHistoryEnabled(!isHistoryEnabled);
		console.log("History enabled:", !isHistoryEnabled);
	};

	const handleKHopToggle = () => {
		setIsKHopEnabled(!isKHopEnabled);
	};

	const handleKValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			setTempKValue(e.target.value);
			setKHopValue(value);
		}
	};

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<Link href="/kosmograph">
				<span className="text-m font-bold pr-3">KG</span>
			</Link>
			<TabsList>
				<TabsTrigger value="general">General</TabsTrigger>
				<TabsTrigger value="info">Info</TabsTrigger>
				<TabsTrigger value="explore">Explore</TabsTrigger>
			</TabsList>
			<TabsContent value="general">
				<div className="flex-1">
					<div className="pt-2 pb-4 space-y-1 text-sm">
						<Accordion type="multiple">
							<SidebarNodeTab />
							<SidebarLinkTab />
							<LinkTypes />
						</Accordion>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="info">
				{globalGraph ? (
					<>
						<div className="flex flex-row items-center justify-left mt-6">
							<span className="text-l pr-3 text-slate-700 dark:text-slate-400">
								Nodes: {globalGraph.nodes().length}
							</span>
							<span className="text-l text-slate-700 dark:text-slate-400">
								Links: {globalGraph.edges().length}
							</span>
						</div>
						<Separator className="h-[3px] mt-3" />
						<div>
							{selectedNode && (
								<div className="flex flex-col mt-3">
									<div className="text-wrap break-all">{selectedNode.id}</div>
									<div className="text-xs mb-3 text-slate-600 dark:text-slate-300">
										Selected Node
									</div>
									<div className="flex flex-row items-center justify-left">
										<div className="flex-col pr-3 mt-3">
											<div>{selectedNode.indegree}</div>
											<div className="text-xs text-slate-600 dark:text-slate-300">
												Out Degree
											</div>
										</div>
										<div className="flex-col mt-3">
											<div>{selectedNode.outdegree}</div>
											<div className="text-xs text-slate-600 dark:text-slate-300">
												In Degree
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</>
				) : (
					<div>Graph not loaded properly!</div>
				)}
			</TabsContent>
			<TabsContent
				value="explore"
				className="flex flex-col items-center justify-center"
			>
				<div className="flex items-center mt-4">
					<span className="pr-3 text-slate-700 dark:text-slate-400">
						History
					</span>
					<button
						type="button"
						role="switch"
						aria-checked={isHistoryEnabled}
						data-state={isHistoryEnabled ? true: false}
						className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isHistoryEnabled ? "bg-primary" : "bg-input"}`}
						onClick={handleHistoryToggle}
					>
						<span
							className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isHistoryEnabled ? "translate-x-5" : "translate-x-0"}`}
						></span>
					</button>
				</div>
				<div className="flex items-center mt-4">
					<span className="pr-3 text-slate-700 dark:text-slate-400">
						K-Hop Neighborhood
					</span>
					<button
						type="button"
						role="switch"
						aria-checked={isKHopEnabled}
						data-state={isKHopEnabled ? true: false}
						className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isKHopEnabled ? "bg-primary" : "bg-input"}`}
						onClick={handleKHopToggle}
					>
						<span
							className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isKHopEnabled ? "translate-x-5" : "translate-x-0"}`}
						></span>
					</button>
				</div>
				{isKHopEnabled && (
					<div className="flex items-center mt-4">
						<input
							type="number"
							min="1"
							value={tempKValue}
							onChange={handleKValueChange}
							className="w-20 p-2 border rounded"
							placeholder="K value"
						/>
					</div>
				)}
			</TabsContent>
		</Tabs>
	);
};

export default SidebarTabs;
// function setVisitedNodes(arg0: Set<unknown>) {
// 	throw new Error("Function not implemented.");
// }

