import Graph from "graphology";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	globalGraphAtom,
	numberOfNeighborsAtom,
	showNodeLabelsAtom,
} from "../atoms/store";

// Define interfaces for your node and link structures
export interface NodeData {
	id: string;
	indegree: number;
	outdegree: number;
}

export interface LinkData {
	source: string;
	target: string;
	type: string;
}

export interface LinkType {
	type: string;

}

// Define an interface for the state managed by useState in the hook
export interface GraphData {
	nodes: NodeData[];
	links: LinkData[];
	linkType: LinkType[];
}

export const useGraphData = () => {
	const [globalGraph] = useAtom<Graph>(globalGraphAtom);
	const [data, setData] = useState<GraphData>({ nodes: [], links: [], linkType: [] });

	useEffect(() => {
		if (!globalGraph) return;

		const nodes: NodeData[] = globalGraph.nodes().map((node) => {
			const attributes = globalGraph.getNodeAttributes(node);
			return {
				id: node,
				indegree: attributes.in as number, // Cast to number if necessary
				outdegree: attributes.out as number, // Cast to number if necessary
			};
		});

		const links: LinkData[] = globalGraph.edges().map((edge) => {
			const edgeData = globalGraph.getEdgeAttributes(edge);
			const source = globalGraph.source(edge);
			const target = globalGraph.target(edge);
			return {
				source,
				target,
				type: edgeData.type as string, // Cast to string if necessary
			};
		});
		//to keep a record of the link  type of the unqiue links
		const linkType: LinkType[] = globalGraph.edges().map((edge) => {
			const edgeData = globalGraph.getEdgeAttributes(edge);
			return {
				type: edgeData.type as string, // Cast to string if necessary
			};
		});
		setData({ nodes, links, linkType });
	}, [globalGraph]);

	return data;
};

export const useTopKNodes = () => {
	const [globalGraph] = useAtom<Graph>(globalGraphAtom);
	const [topKNodes, setTopKNodes] = useState<NodeData[]>([]);
	const [numberLabels, setNumberLabels] = useAtom(numberOfNeighborsAtom);

	useEffect(() => {
		if (!globalGraph) return;

		const nodesWithDegrees = globalGraph.nodes().map((node) => {
			const attributes = globalGraph.getNodeAttributes(node);
			return {
				id: node,
				indegree: attributes.in as number, // Cast to number if necessary
				outdegree: attributes.out as number, // Cast to number if necessary
			};
		});

		// Sort the nodes by their total degree
		nodesWithDegrees.sort(
			(a, b) => b.indegree + b.outdegree - a.indegree - a.outdegree
		);

		// Take the top k nodes
		const topKNodes = nodesWithDegrees.slice(0, numberLabels);

		setTopKNodes(topKNodes);
	}, [globalGraph, numberLabels]);

	return topKNodes;
};

// export default useGraphData;
