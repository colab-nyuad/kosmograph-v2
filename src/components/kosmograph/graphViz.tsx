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
import React, { useEffect, useState } from "react";
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
const createGraph = (nodes: NodeData[], links: LinkData[]) => {
    const newGraph = new Graph();

    nodes.forEach((node) => {
        newGraph.addNode(node.id, { in: node.indegree, out: node.outdegree });
    });

    links.forEach((link) => {
        newGraph.addEdge(link.source, link.target, { type: link.type });
    });

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
    const [numberOfNeighbors] = useAtom(numberOfNeighborsAtom);
    const [activeTab, setActiveTab] = useAtom(activeTabAtom);
    const [showLabelsFor, setShowLabelsFor] = useState<NodeData[] | undefined>([]);
    const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

    const [graphData, setGraphData] = useState<{ nodes: NodeData[], links: LinkData[] } | null>(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            const response = await fetch('/data/sampletext.json');
            const data = await response.json();

            const nodes: NodeData[] = [];
            const links: LinkData[] = [];

            data.forEach((record: { subject: string; predicate: string; object: string }) => {
                const { subject, predicate, object } = record;

                nodes.push({
                    id: subject,
                    indegree: 0,
                    outdegree: 0
                });

                nodes.push({
                    id: object,
                    indegree: 0,
                    outdegree: 0
                });

                links.push({
                    source: subject,
                    target: object,
                    type: predicate
                });
            });

            // Remove duplicate nodes
            const uniqueNodes = Array.from(new Set(nodes.map(node => node.id)))
                .map(id => nodes.find(node => node.id === id)!);

            setGraphData({ nodes: uniqueNodes, links });
        };

        fetchGraphData();
    }, []);

    useEffect(() => {
        if (graphData) {
            const newGraph = createGraph(graphData.nodes, graphData.links);
            setGlobalGraph(newGraph);
        }
    }, [graphData, setGlobalGraph]);

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
                    let current = queue.shift();
                    if (current && current.depth <= numberOfNeighbors) {
                        let depth = current?.depth || 1;
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
                                    depth: depth + 1,
                                });
                            }
                        );
                    }
                }
            } else {
                // TODO: Add any necessary cleanup or reset logic here
            }
        },
        [numberOfNeighbors, globalGraph]
    );

    const calculateNodeSize = () => {
        const total = Math.sqrt(graphData?.links.length || 1);
        switch (nodeSize) {
            case "total":
                return (n: any) =>
                    ((n.indegree + n.outdegree) / total) * 10 * nodeScale[0] + 1;
            case "incoming":
                return (n: any) => (n.indegree / total) * 10 * nodeScale[0] + 1;
            case "outgoing":
                return (n: any) => (n.outdegree / total) * 10 * nodeScale[0] + 1;
            default:
                return (n: any) => 15 * nodeScale[0];
        }
    };

    const calculateColorSize = () => {
        const total = Math.sqrt(graphData?.links.length || 1);
        const getColorBetween = (scale: number, total: number) => {
            // TODO: logic to get color between a scale and total
        };
        switch (nodeColor) {
            case "total":
                return (n: any) => getColorBetween(n.indegree + n.outdegree, total);
            case "incoming":
                return (n: any) => getColorBetween(n.indegree, total);
            case "outgoing":
                return (n: any) => getColorBetween(n.outdegree, total);
            default:
                return () => "#455BB7CC";
        }
    };

    const themeToUse = theme === "dark" ? "#030014" : "#fafafa";

    if (!graphData) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className={clsx(
                "flex items-center justify-center bg-white dark:bg-brand-dark w-[99.5vw] h-[98vh]"
            )}
        >
            <CosmographProvider>
                <Cosmograph
                    ref={cosmographRef}
                    nodes={graphData.nodes}
                    links={graphData.links}
                    backgroundColor={themeToUse}
                    //nodeColor={calculateColorSize()}
                    nodeSize={calculateNodeSize()}
                    linkWidth={1}
                    linkArrowsSizeScale={1}
                    linkGreyoutOpacity={0.0}
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
