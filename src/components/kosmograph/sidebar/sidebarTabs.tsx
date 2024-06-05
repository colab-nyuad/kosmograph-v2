import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";
import { Accordion } from "../../ui/accordion";
import {
	activeTabAtom,
	globalGraphAtom,
	selectedNodeAtom,
} from "../atoms/store";
import { LinkTypes } from "../linkTypes";
import SidebarLinkTab from "./sidebarLinkTab";
import SidebarNodeTab from "./sidebarNodeTab";

const SidebarTabs = () => {
	const [activeTab, setActiveTab] = useAtom(activeTabAtom);
	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);

	// Pass this function to the node click even to navigate to the info tab
	const navigateToTab = (tabValue: React.SetStateAction<string>) => {
		setActiveTab(tabValue);
	};
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			{/* <div className="flex items-center justify-between"> */}
			<Link href="/kosmograph">
				<span className="text-m font-bold pr-3">KG</span>
			</Link>
			{/* </div> */}
			<TabsList>
				<TabsTrigger value="general">General</TabsTrigger>
				<TabsTrigger value="info">Info</TabsTrigger>
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
												In Degree
											</div>
										</div>

										<div className="flex-col mt-3">
											<div>{selectedNode.outdegree}</div>
											<div className="text-xs text-slate-600 dark:text-slate-300">
												Out Degree
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
		</Tabs>
	);
};

export default SidebarTabs;






// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAtom } from "jotai";
// import Link from "next/link";
// import React from "react";
// import { Accordion } from "../../ui/accordion";
// import {
// 	activeTabAtom,
// 	globalGraphAtom,
// 	selectedNodeAtom,
// } from "../atoms/store";
// import { LinkTypes } from "../linkTypes";
// import SidebarLinkTab from "./sidebarLinkTab";
// import SidebarNodeTab from "./sidebarNodeTab";
// import { useState } from "react";
// import { NodeData } from "../hooks/useGraphData";

// const SidebarTabs = () => {
// 	const [activeTab, setActiveTab] = useAtom(activeTabAtom);
// 	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
// 	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);
// 	const [visitedNodes, setVisitedNodes] = useState<Set<NodeData>>(new Set());

// 	// Function to reset node selections and clear visited nodes
// 	const resetSelection = () => {
// 		//@ts-ignore
// 		cosmographRef.current?.unselectNodes();
// 		setVisitedNodes(new Set());
// 		setSelectedNode(undefined);
// 	};

// 	return (
// 		<Tabs value={activeTab} onValueChange={setActiveTab}>
// 			<Link href="/kosmograph">
// 				<span className="text-m font-bold pr-3">KG</span>
// 			</Link>
// 			<TabsList>
// 				<TabsTrigger value="general">General</TabsTrigger>
// 				<TabsTrigger value="info">Info</TabsTrigger>
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
// 												In Degree
// 											</div>
// 										</div>

// 										<div className="flex-col mt-3">
// 											<div>{selectedNode.outdegree}</div>
// 											<div className="text-xs text-slate-600 dark:text-slate-300">
// 												Out Degree
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							)}
// 						</div>
// 						{/* Reset Button */}
// 						<div className="mt-4">
// 							<button
// 								className="px-4 py-2 bg-blue-500 text-white rounded"
// 								onClick={resetSelection}
// 							>
// 								Reset Selection
// 							</button>
// 						</div>
// 					</>
// 				) : (
// 					<div>Graph not loaded properly!</div>
// 				)}
// 			</TabsContent>
// 		</Tabs>
// 	);
// };

// export default SidebarTabs;
