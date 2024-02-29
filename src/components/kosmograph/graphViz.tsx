import { getColorBetween } from "@/lib/utils";
import {
	Cosmograph,
	CosmographInputConfig,
	CosmographProvider,
} from "@cosmograph/react";
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
	numberOfNodeLabels,
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

	// Add 3000 edges with no duplicates, self-loops, and assign a link type
	let edgesAdded = 0;
	while (edgesAdded < 3000) {
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
}: {
	cosmographRef: React.MutableRefObject<null>;
}) {
	const { theme } = useTheme();
	const [globalGraph, setGlobalGraph] = useAtom(globalGraphAtom);
	const [nodeLabel] = useAtom(showNodeLabelsAtom);
	const [nodeScale] = useAtom(nodeScaleAtom);
	const [nodeSize] = useAtom(nodeSizeAtom);
	const [nodeColor] = useAtom(nodeColorAtom);
	const { nodes, links } = useGraphData();
	const [numberOfLabels] = useAtom(numberOfNodeLabels);

	const [activeTab, setActiveTab] = useAtom(activeTabAtom);

	const [showLabelsFor, setShowLabelsFor] = React.useState<
		NodeData[] | undefined
	>([]);
	const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

	// const createGraph
	React.useEffect(() => {
		// Initialize or update the global graph here
		// For example, to add a node and an edge:
		const newGraph = createGraph();
		setGlobalGraph(newGraph);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCosmographClick = React.useCallback<
		Exclude<CosmographInputConfig<NodeData, LinkData>["onClick"], undefined>
	>((n) => {
		if (n) {
			let neighbors: NodeData[] = [n];

			// Get neighbors of the selected node
			globalGraph.forEachNeighbor(n.id, function (neighbor, attributes) {
				neighbors.push({
					id: neighbor,
					indegree: attributes.in,
					outdegree: attributes.out,
				});
			});

			// @ts-expect-error: Resetting selected node
			cosmographRef.current?.selectNodes([...neighbors]);
			// cosmographRef.current?.selectNode(n, true);

			setActiveTab("info");

			setShowLabelsFor([n]);
			setSelectedNode(n);
		} else {
			// @ts-expect-error: Resetting selected node
			cosmographRef.current?.unselectNodes();
			setActiveTab("general");
			setShowLabelsFor(undefined);
			setSelectedNode(undefined);
		}
	}, []);

	const calculateNodeSize = () => {
		const total = nodes.length;
		switch (nodeSize) {
			case "total":
				return (n: any, i: any) => {
					return (
						((n.indegree + n.outdegree) / total) *
							10 *
							nodeScale[0] *
							(cosmographRef.current as any)?.getZoomLevel() +
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
			default:
				return (n: any, i: any) => 10 * nodeScale[0];
		}
	};
	const calculateColorSize = () => {
		const total = links.length;
		switch (nodeColor) {
			case "total":
				return (n: any, i: any) => {
					const scale =
						((n.indegree + n.outdegree) / total) *
							10 *
							(cosmographRef.current as any)?.getZoomLevel() +
						1;
					return getColorBetween(scale, total);
				};

			case "incoming":
				return (n: any, i: any) => {
					const scale =
						(n.indegree / total) *
							10 *
							(cosmographRef.current as any)?.getZoomLevel() +
						1;
					return getColorBetween(scale, total);
				};
			case "outgoing":
				return (n: any, i: any) => {
					const scale =
						(n.outdegree / total) *
							10 *
							(cosmographRef.current as any)?.getZoomLevel() +
						1;
					return getColorBetween(scale, total);
				};
			default:
				return (n: any, i: any) => "#455BB7CC";
		}
	};

	// const nodeSizer = calculateNodeSize();
	// console.log(calculateNodeColor(1)); // #7F007FCC
	const themeToUse = theme === "dark" ? "#030014" : "#fafafa";
	return (
		<div className="flex w-[84.5vw] h-[99vh] items-center justify-center bg-white dark:bg-brand-dark">
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
					// nodeSize={25}
					// nodeSize={(n, i) => (n.indegree + n.outdegree) * 4}
					nodeSize={calculateNodeSize()}
					linkWidth={1}
					linkArrowsSizeScale={1}
					linkGreyoutOpacity={0.2}
					// backgroundColor="#f5f5f5"
					focusedNodeRingColor={"red"}
					hoveredNodeRingColor={"rgb(244, 63, 94)"}
					nodeLabelClassName={"text-white"}
					hoveredNodeLabelClassName={"text-teal-400"}
					nodeGreyoutOpacity={0.2}
					curvedLinks={false}
					showLabelsFor={showLabelsFor}
					showDynamicLabels={nodeLabel}
					showTopLabels={nodeLabel}
					showHoveredNodeLabel={nodeLabel}
					showTopLabelsLimit={3}
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
			</CosmographProvider>
		</div>
	);
}

export default GraphViz;
