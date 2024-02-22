import {
	SigmaContainer,
	useLoadGraph,
	useRegisterEvents,
	useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import Graph from "graphology";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const LoadGraph = () => {
	const loadGraph = useLoadGraph();
	useEffect(() => {
		const graph = new Graph();
		// Add 2000 nodes
		for (let i = 1; i <= 200; i++) {
			graph.addNode(`node${i}`, {
				x: Math.random() * 1000, // Spread out the X position more
				y: Math.random() * 1000, // Spread out the Y position more
				size: 5, // Keep the size small to accommodate many nodes
				label: `Node ${i}`, // Label the nodes
				color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
			});
		}

		// Add 5000 edges between random nodes
		let attempts = 0; // To prevent infinite loops
		for (let i = 0; i < 500; i++) {
			const source = `node${Math.floor(Math.random() * 200) + 1}`;
			let target = `node${Math.floor(Math.random() * 200) + 1}`;
			while (target === source && attempts < 10000) {
				// Ensure that the source and target are not the same, with a limit to attempts
				target = `node${Math.floor(Math.random() * 200) + 1}`;
				attempts++;
			}
			if (!graph.hasEdge(source, target)) {
				graph.addEdge(source, target);
			} else {
				i--; // Decrement i to ensure 5000 unique edges are added
			}
		}

		loadGraph(graph);
	}, [loadGraph]);

	return null;
};

const Fa2: React.FC = () => {
	const { start, kill, isRunning } = useWorkerLayoutForceAtlas2({
		settings: { slowDown: 10 },
	});

	useEffect(() => {
		// start FA2
		start();
		return () => {
			// Kill FA2 on unmount
			kill();
		};
	}, [start, kill]);

	return null;
};

const GraphEvents = () => {
	const registerEvents = useRegisterEvents();
	const sigma = useSigma();
	const [draggedNode, setDraggedNode] = useState<string | null>(null);

	useEffect(() => {
		registerEvents({
			downNode: (e) => {
				setDraggedNode(e.node);
				sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
			},
			mouseup: () => {
				if (draggedNode) {
					setDraggedNode(null);
					sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
				}
			},
			mousemove: (e) => {
				if (draggedNode) {
					const pos = sigma.viewportToGraph(e);
					sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
					sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

					e.preventSigmaDefault();
					e.original.preventDefault();
					e.original.stopPropagation();
				}
			},
			// Add touch events if needed
		});
	}, [registerEvents, sigma, draggedNode]);

	return null;
};

export const DisplayGraph = () => {
	const { theme: theme } = useTheme();
	return (
		<SigmaContainer
			style={{
				height: "100vh",
				width: "87.5vw",
				backgroundColor: theme === "dark" ? "#030014" : "#ffffff",
			}}
		>
			{" "}
			{/* Adjusted for larger view */}
			<LoadGraph />
			<GraphEvents />
			<Fa2 />
		</SigmaContainer>
	);
};
