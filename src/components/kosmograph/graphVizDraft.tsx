import { getColorBetween } from "@/lib/utils";
import {
    Cosmograph,
    CosmographInputConfig,
    CosmographProvider,
    CosmographRef,
} from "@cosmograph/react";
import clsx from "clsx";
import Graph from "graphology";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import React, { useEffect, useState, useRef } from "react";
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
import { LinkData, NodeData } from "./hooks/useGraphData";

const createGraph = (nodes: NodeData[], links: LinkData[]) => {
    const newGraph = new Graph();

    nodes.forEach((node) => {
        newGraph.addNode(node.id, { in: node.indegree, out: node.outdegree });
    });

    links.forEach((link) => {
        if (!newGraph.hasEdge(link.source, link.target)) {
            newGraph.addEdge(link.source, link.target, { type: link.type });
        }
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
    const [clickedLink, setClickedLink] = useState<LinkData | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [graphData, setGraphData] = useState<{ nodes: NodeData[], links: LinkData[], linkTypeColors: Record<string, string> } | null>(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            const response = await fetch('/data/uploadFile.json');
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

            const linkTypeColors = getUniqueLinkTypesWithColors(links);

            setGraphData({ nodes: uniqueNodes, links, linkTypeColors });
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
                //@ts-ignore
                cosmographRef.current?.selectNodes([...neighbors] as any);
                setActiveTab("info");
                setShowLabelsFor([n]);
                setSelectedNode(n);
            } else {
                //@ts-ignore
                cosmographRef.current?.unselectNodes();
                setActiveTab("general");
                setShowLabelsFor(undefined);
                setSelectedNode(undefined);
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

    const getColorBetween = (scale: number, total: number) => {
        const startColor = { r: 69, g: 91, b: 183 }; // #455BB7
        const endColor = { r: 244, g: 63, b: 94 }; // #F43F5E

        const ratio = Math.min(scale / total, 1);

        const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
        const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
        const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));

        return `rgb(${r}, ${g}, ${b})`;
    };

    const calculateColorSize = () => {
        const total = Math.sqrt(graphData?.links.length || 1);
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

    // Generating link type colors
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const getUniqueLinkTypesWithColors = (links: LinkData[]) => {
        const linkTypeColors: Record<string, string> = {};
        links.forEach((link) => {
            if (!linkTypeColors[link.type]) {
                linkTypeColors[link.type] = generateRandomColor();
            }
        });
        return linkTypeColors;
    };

    const getLinkColor = (link: LinkData) => {
        return graphData?.linkTypeColors[link.type] || '#000000';
    };

    // Handle click events for links
    const handleClick = (event: MouseEvent) => {
        const target = event.target as SVGElement;
        const linkId = target.getAttribute('data-link-id');
        if (linkId && graphData) {
            const [source, target] = linkId.split('-');
            const link = graphData.links.find((l) => l.source === source && l.target === target);
            setClickedLink(link || null);
        } else {
            setClickedLink(null);
        }
    };

    const themeToUse = theme === "dark" ? "#030014" : "#fafafa";

    useEffect(() => {
        if (graphData && svgRef.current) {
            const svg = svgRef.current;
            const links = svg.querySelectorAll('line');
            links.forEach((link) => {
                link.addEventListener('click', handleClick);
            });

            return () => {
                links.forEach((link) => {
                    link.removeEventListener('click', handleClick);
                });
            };
        }
    }, [graphData]);

    if (!graphData) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className={clsx(
                "flex items-center justify-center bg-white dark:bg-brand-dark w-[99.5vw] h-[98vh]"
            )}
        >
            {clickedLink && (
                <div
                    className="absolute z-50 p-2 bg-gray-800 text-white rounded"
                    style={{ left: `50%`, top: `50%` }} // Adjust positioning as needed
                >
                    {clickedLink.type}
                </div>
            )}
            <CosmographProvider>
                <Cosmograph
                    ref={cosmographRef}
                    nodes={graphData.nodes}
                    links={graphData.links.map(link => ({ ...link, data: { linkId: `${link.source}-${link.target}` } }))}
                    backgroundColor={themeToUse}
                    nodeColor={calculateColorSize()}
                    nodeSize={calculateNodeSize()}
                    linkWidth={1}
                    linkColor={getLinkColor}
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
            <svg ref={svgRef} />
        </div>
    );
}

export default GraphViz;
