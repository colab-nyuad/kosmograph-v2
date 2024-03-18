import { getColorBetween } from "@/lib/utils";
import {
	Cosmograph,
	CosmographInputConfig,
	CosmographProvider,
	CosmographSearch,
} from "@cosmograph/react";
import clsx from "clsx";
import Graph from "graphology";
import { useAtom } from "jotai";
import { TrendingUpIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import {
	activeTabAtom,
	globalGraphAtom,
	nodeColorAtom,
	nodeScaleAtom,
	nodeSizeAtom,
	numberOfNeighborsAtom,
	selectedNodeAtom,
	showNodeLabelsAtom,
} from "./atoms/store";
import { LinkData, NodeData, useGraphData } from "./hooks/useGraphData";

// const createGraph = () => {
// 	const newGraph = new Graph();
// 	// const newGraph = graph.copy(); // Create a copy to avoid direct mutation
// 	newGraph.addNode(
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		{ in: 2, out: 3 }
// 	);
// 	newGraph.addNode("nodeB", { in: 1, out: 0 });
// 	newGraph.addNode("nodeC", { in: 1, out: 2 });
// 	newGraph.addNode("nodeD", { in: 2, out: 2 });

// 	newGraph.addEdge(
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		"nodeB",
// 		{ type: "Link Type A->B" }
// 	);
// 	newGraph.addEdge(
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		"nodeC",
// 		{ type: "Link Type A->C" }
// 	);
// 	newGraph.addEdge(
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		"nodeD",
// 		{ type: "Link Type A->D" }
// 	);

// 	newGraph.addEdge(
// 		"nodeC",
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		{ type: "Link Type C->A" }
// 	);
// 	newGraph.addEdge("nodeC", "nodeD", { type: "Link Type C->D" });

// 	newGraph.addEdge(
// 		"nodeD",
// 		"http://citygraph.co/entity/statement/P1-bc686c36-484e-7f36-ba0d-cc0ad7642331",
// 		{ type: "Link Type D->A" }
// 	);

// 	return newGraph; // Return the updated graph
// };

const createGraph = () => {
	const newGraph = new Graph();
	const linkTypes = ["Type1", "Type2", "Type3"]; // Example link types

	// Initialize 1000 nodes with in-degree and out-degree attributes
	for (let i = 0; i < 1000; i++) {
		newGraph.addNode(`node${i}`, { in: 0, out: 0 });
	}

	// Add 2000 edges with no duplicates, self-loops, and assign a link type
	let edgesAdded = 0;
	while (edgesAdded < 2000) {
		const sourceIndex = Math.floor(Math.random() * 1000);
		const targetIndex = Math.floor(Math.random() * 1000);
		const source = `node${sourceIndex}`;
		const target = `node${targetIndex}`;

		// Ensure no self-loops and duplicate edges
		if (source !== target && !newGraph.hasEdge(source, target)) {
			const linkType = linkTypes[Math.floor(Math.random() * linkTypes.length)]; // Randomly select a link type
			newGraph.addEdge(source, target, { type: linkType });

			// Update in-degree and out-degree
			newGraph.setNodeAttribute(
				target,
				"in",
				newGraph.getNodeAttribute(target, "in") + 1
			);
			newGraph.setNodeAttribute(
				source,
				"out",
				newGraph.getNodeAttribute(source, "out") + 1
			);

			edgesAdded++;
		}
	}
	return newGraph;
};

export function GraphViz({
	cosmographRef,
	sidebarOpen,
}: {
	cosmographRef: React.MutableRefObject<null>;
	sidebarOpen: boolean;
}) {
	const { theme } = useTheme();
	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);
	const [nodeLabel] = useAtom(showNodeLabelsAtom);
	const [nodeScale] = useAtom(nodeScaleAtom);
	const [nodeSize] = useAtom(nodeSizeAtom);
	const [nodeColor] = useAtom(nodeColorAtom);
	const { nodes, links } = useGraphData();
	const [numberOfNeighbors] = useAtom(numberOfNeighborsAtom);
	const [activeTab, setActiveTab] = useAtom(activeTabAtom);

	const [showLabelsFor, setShowLabelsFor] = React.useState<
		NodeData[] | undefined
	>([]);
	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

	// const createGraph
	React.useEffect(() => {
		// Initialize or update the global graph
		const newGraph = createGraph();
		setGlobalGraph(newGraph);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCosmographClick = React.useCallback<
		Exclude<CosmographInputConfig<NodeData, LinkData>["onClick"], undefined>
	>(
		(n) => {
			if (n) {
				let neighbors: NodeData[] = [n];

				let queue: { node: NodeData; depth: number }[] = [
					{ node: n, depth: 1 },
				];

				while (queue.length > 0) {
					let current = queue.shift(); // Dequeue a node from front of the queue

					if (current && current.depth <= numberOfNeighbors) {
						globalGraph.forEachNeighbor(
							current.node.id,
							function (neighbor, attributes) {
								neighbors.push({
									id: neighbor,
									indegree: attributes.in,
									outdegree: attributes.out,
								});

								queue.push({
									node: {
										id: neighbor,
										indegree: attributes.in,
										outdegree: attributes.out,
									},
									depth: current.depth + 1,
								});
							}
						);
					}
				}
				// // Get neighbors of the selected node
				// globalGraph.forEachNeighbor(n.id, function (neighbor, attributes) {
				// 	neighbors.push({
				// 		id: neighbor,
				// 		indegree: attributes.in,
				// 		outdegree: attributes.out,
				// 	});
				// });

				// console.log(neighbors);
				// @ts-expect-error: Resetting selected node
				cosmographRef.current?.selectNodes([...neighbors]);
				// cosmographRef.current?.selectNode(n, true);

				setActiveTab("info");

				// setShowLabelsFor([...neighbors].slice(1));
				// const labels = [...neighbors].slice(1); // rendering issue
				setShowLabelsFor([n]);
				setSelectedNode(n);
			} else {
				// @ts-expect-error: Resetting selected node
				cosmographRef.current?.unselectNodes();
				setActiveTab("general");
				setShowLabelsFor(undefined);
				setSelectedNode(undefined);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[numberOfNeighbors, globalGraph]
	);

	const calculateNodeSize = () => {
		const total = Math.sqrt(links.length);
		let MaxSize = 10 * nodeScale[0] * Math.sqrt(links.length); // suitable value for max size
		console.log((cosmographRef.current as any)?.getZoomLevel());
		switch (nodeSize) {
			case "total":
				return (n: any, i: any) => {
					return (
						((n.indegree + n.outdegree) / total) *
							10 *
							nodeScale[0] *
							Math.min((cosmographRef.current as any)?.getZoomLevel(), 20) +
						1
					);
				};
			// ((n.indegree + n.outdegree) / total) * 10 * nodeScale[0] + 1;
			case "incoming":
				return (n: any, i: any) =>
					(n.indegree / total) *
						10 *
						nodeScale[0] *
						(cosmographRef.current as any)?.getZoomLevel() +
					1;
			case "outgoing":
				return (n: any, i: any) =>
					(n.outdegree / total) *
						10 *
						nodeScale[0] *
						(cosmographRef.current as any)?.getZoomLevel() +
					1;
			case "default":
				return (n: any, i: any) => 15 * nodeScale[0];
		}
	};
	const calculateColorSize = () => {
		const total = Math.sqrt(links.length);
		switch (nodeColor) {
			case "total":
				return (n: any, i: any) => {
					const scale = n.indegree + n.outdegree;
					if (n.id == "node178") {
						console.log(scale, total, getColorBetween(scale, total));
					}
					return getColorBetween(scale, total);
				};

			case "incoming":
				return (n: any, i: any) => {
					const scale = n.indegree;
					return getColorBetween(scale, total);
				};
			case "outgoing":
				return (n: any, i: any) => {
					const scale = n.outdegree;
					return getColorBetween(scale, total);
				};
			case "default":
				return (n: any, i: any) => "#455BB7CC";
		}
	};

	// const nodeSizer = calculateNodeSize();
	// console.log(calculateNodeColor(1)); // #7F007FCC
	const themeToUse = theme === "dark" ? "#030014" : "#fafafa";

	return (
		<div
			className={clsx(
				"flex  items-center justify-center bg-white dark:bg-brand-dark w-[99.5vw] h-[98vh]"
				// {
				// 	"w-[83.5vw] h-[99vh]": !sidebarOpen,
				// 	"w-[99.5vw] h-[98vh]": sidebarOpen,
				// }
			)}
		>
			<CosmographProvider>
				<Cosmograph
					ref={cosmographRef}
					nodes={nodes}
					links={links}
					backgroundColor={themeToUse}
					// @ts-ignore
					// nodeColor="#4B5BBFCC"
					nodeColor={calculateColorSize()}
					// nodeSizeScale={nodeScale[0]}
					nodeSize={calculateNodeSize()}
					linkWidth={1}
					linkArrowsSizeScale={1}
					linkGreyoutOpacity={0.0}
					// backgroundColor="#f5f5f5"
					focusedNodeRingColor={"red"}
					hoveredNodeRingColor={"rgb(244, 63, 94)"}
					nodeLabelClassName={"text-white"}
					hoveredNodeLabelClassName={"text-teal-400"}
					nodeGreyoutOpacity={0.0}
					curvedLinks={false}
					showLabelsFor={showLabelsFor}
					showDynamicLabels={false}
					showTopLabels={nodeLabel}
					showHoveredNodeLabel={nodeLabel}
					showTopLabelsLimit={0}
					// simulationLinkDistance={nodes.length < 200 ? 20 : 5}
					useQuadtree={true}
					disableSimulation={false}
					fitViewOnInit={true}
					initialZoomLevel={162}
					randomSeed={42}
					scaleNodesOnZoom={false}
					simulationFriction={0.1}
					simulationLinkSpring={0.5}
					simulationLinkDistance={2.0}
					simulationRepulsionFromMouse={5.0}
					onClick={onCosmographClick}
				/>
				{/* <CosmographSearch /> */}
			</CosmographProvider>
		</div>
	);
}

export default GraphViz;
