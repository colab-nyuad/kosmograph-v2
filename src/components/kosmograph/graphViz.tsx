// @ts-nocheck 
import { LinkTypes } from "../kosmograph/linkTypes";
import { getColorBetween } from "@/lib/utils";
import {
    Cosmograph,
    CosmographInputConfig,
    CosmographProvider,
} from "@cosmograph/react";
import clsx from "clsx";
import Graph from "graphology";
import { useAtom } from "jotai";
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
import { LinkData, NodeData } from "./hooks/useGraphData";
import { Accordion } from "@/components/ui/accordion"; // Import the Accordion component
import { set } from "zod";
import { log } from "console";
import { get } from "http";

//node sizes global
const maxNodeSize = 500;
const minNodeSize = 15;



const createGraph = (nodes: NodeData[], links: LinkData[]) => {
    const newGraph = new Graph();

    nodes.forEach((node) => {
        newGraph.addNode(node.id, { in: node.indegree, out: node.outdegree, nodeSize : 1 });
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
    const [enabledLinkTypes, setEnabledLinkTypes] = useState<Record<string, boolean>>({});
    const [graphData, setGraphData] = useState<{ nodes: NodeData[], links: LinkData[], linkTypeColors: Record<string, string> } | null>(null);
    const [visitedNodes, setVisitedNodes] = useState([]);
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
            console.log("link colors", linkTypeColors);

            setGraphData({ nodes: uniqueNodes, links, linkTypeColors });
            
        };

        fetchGraphData();
    }, []);

    useEffect(() => {
        if (graphData) {
            const newGraph = createGraph(graphData.nodes, graphData.links);
            setGlobalGraph(newGraph);
            setDegree(graphData);
            const initialEnabledLinkTypes = Object.keys(graphData.linkTypeColors).reduce((acc, type) => {
                acc[type] = true;
                return acc;
            }, {} as Record<string, boolean>);

            setEnabledLinkTypes(initialEnabledLinkTypes);
        }
    }, [graphData, setGlobalGraph]);


    const onCosmographClick = React.useCallback<Exclude<CosmographInputConfig<NodeData, LinkData>["onClick"], undefined>>(
        (n) => {
          if (n) {

            let neighbors: NodeData[] = [n];
 
            // Collect neighbors with updated indegree and outdegree
            globalGraph.forEachNeighbor(n.id, (neighbor, attributes) => {
              neighbors.push({
                id: neighbor,
                indegree: 0,
                outdegree:0, 
              });
            });
      
            //@ts-ignore
            cosmographRef.current?.selectNodes([...neighbors] as any);
            setActiveTab("info");
            setShowLabelsFor([n]);
            setSelectedNode(n);
          } else {
            //@ts-ignore
            // cosmographRef.current?.unselectNodes();
            // setActiveTab("general");
            // setShowLabelsFor(undefined);
            // setSelectedNode(undefined);
          }
        },
        [globalGraph]
    );

    

    const setDegree = (graphData: { nodes: NodeData[]; links: LinkData[]; linkTypeColors: Record<string, string>; } | null) => { 
        //@ts-expect-error
        graphData.nodes.forEach((node) => {
            let indegree = 0; 
            let outdegree = 0; 
            //@ts-expect-error
            graphData.links.forEach((link) => {
                if (link.source === node.id) {
                    indegree++;
                }
                if (link.target === node.id) {
                    outdegree++;
                }
            });
            node.indegree = indegree;
            node.outdegree = outdegree;
        });
    }
      
      
    const calculateNodeSize = () => {
        // setDegree(graphData);
        //console.log(graphData?.nodes);
    
        const total = Math.sqrt(graphData?.links.length || 1);
        //console.log(nodeScale[0]);
    
        let nodeSize = 'total';
        const minSize = 15; // Minimum size for nodes
        const maxSize = maxNodeSize; // Maximum size for nodes
    
        const scaleSize = (size) => Math.min(maxSize, Math.max(minSize, size));
    
        switch (nodeSize) {
            case "total":
                return (n) => {
                    const size = ((n.indegree + n.outdegree) / total ) * 30 * nodeScale[0] + 1;
                    return scaleSize(size);
                };
            case "incoming":
                return (n) => {
                    const size = (n.indegree / total) * 10 * nodeScale[0] + 1;
                    return scaleSize(size);
                };
            case "outgoing":
                return (n) => {
                    const size = (n.outdegree / total) * 10 * nodeScale[0] + 1;
                    return scaleSize(size);
                };
            default:
                return (n) => 15 * nodeScale[0];
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
	

    // Function to darken a hex color
    const darkenColor = (color, percent) => {
        let num = parseInt(color.slice(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return (
            "#" +
            (0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16)
                .slice(1)
        );
    };

    const calculateColorSize = () => {
        const getNodeSize = calculateNodeSize();
    
        // Base colors for shades of pink
        const colors = [
            "#FFC0CB", // Light pink
            "#FF69B4", // Hot pink
            "#FF1493", // Deep pink
            "#DB7093"  // Pale violet red
        ];
    
        return (node) => {
            
            const size = getNodeSize(node);
            let colorIndex;
            if (size!=15){
                const maxNodeSize = Math.max(...graphData?.nodes.map((n) => getNodeSize(n)));
                colorIndex= Math.floor((size / maxNodeSize) * (colors.length - 1) );
            }
            else{
                colorIndex=0;
            }
            return colors[colorIndex];
        };
    };
    
    

//Generating link type colors
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
        //console.log(linkTypeColors);
        return linkTypeColors;
    };

    const getLinkColor = (link: LinkData) => {
        return graphData?.linkTypeColors[link.type] || '#000000';
    };

    const themeToUse = theme === "dark" ? "#030014" : "#fafafa";

    if (!graphData) {
        return <div>Loading...</div>;
    }
    const colors = ['#E6A0AF', '#CC8093', '#B36078', "#FFC0CB"];;
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
                    nodeColor={calculateColorSize()}
                    //nodeColor={() => colors[Math.floor((calculateNodeSize()/maxNodeSize)  * colors.length)]}
                    nodeSize={calculateNodeSize()}
                    linkWidth={1}
                    linkColor={getLinkColor}
                    linkArrowsSizeScale={1}
                    linkGreyoutOpacity={0.0}
                    focusedNodeRingColor={"blue"}
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
                    simulationLinkDistance={18}
                    simulationRepulsionFromMouse={5.0}
                    onClick={onCosmographClick}
                    nodeSamplingDistance={10.0}
                    simulationRepulsion={1.0}

                />
            </CosmographProvider>
            {// @ts-ignore
            <Accordion>
                <LinkTypes linkTypes={graphData.linkTypeColors} onToggle={setEnabledLinkTypes} />
            </Accordion>
            }
            
        </div>
    );
}

export default GraphViz;
