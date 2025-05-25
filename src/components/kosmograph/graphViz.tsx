// @ts-nocheck 

// GraphViz.tsx
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
import React, { useEffect, useState, useMemo } from "react"; // Import useMemo
import {
  activeTabAtom,
  globalGraphAtom,
  nodeColorAtom,
  nodeScaleAtom,
  nodeSizeAtom,
  numberOfNeighborsAtom,
  selectedNodeAtom,
  showNodeLabelsAtom,
  linkTypeColorsAtom,
  selectedLinkTypeAtom,
  LinkTypesSelctionAtom,
  isHistoryEnabledAtom,
  fileNameAtom,
  fileDataAtom,
  isDirectedAtom,
  //colorSetAtom,
  queryAtom,
} from "./atoms/store";
import { LinkData, LinkType, NodeData } from "./hooks/useGraphData";
import { Accordion } from "@/components/ui/accordion"; // Import the Accordion component
import { set } from "zod";
import { log } from "console";
import { get } from "http";
import SidebarTabs from "./sidebar/sidebarTabs";

//node sizes global
const maxNodeSize = 500;
const minNodeSize = 15;

const createGraph = (nodes: NodeData[], links: LinkData[]) => {
  const newGraph = new Graph();

  nodes.forEach((node) => {
    newGraph.addNode(node.id, {
      in: node.indegree,
      out: node.outdegree,
      nodeSize: 1,
    });
  });

  links.forEach((link) => {
    if (!newGraph.hasEdge(link.source, link.target)) {
      newGraph.addEdge(link.source, link.target, { type: link.type });
    }
  });

  return newGraph;
};

export function GraphViz({ cosmographRef, sidebarOpen }: { cosmographRef: React.MutableRefObject<null>; sidebarOpen: boolean; }) {
  //const [color, setColor] = useAtom(colorSetAtom);

  const [query] = useAtom(queryAtom);
  const [isDirected] = useAtom(isDirectedAtom);
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
  const [visitedNodes, setVisitedNodes] = useState<Set<NodeData>>(new Set());
  const [linkTypeColors, setLinkTypeColors] = useAtom(linkTypeColorsAtom);
  const [selectedLinkType, setSelectedLinkType] = useAtom(selectedLinkTypeAtom);
  const [linkTypes, setLinkTypes] = useAtom(LinkTypesSelctionAtom);
  const [isHistoryEnabled, setIsHistoryEnabled] = useAtom(isHistoryEnabledAtom);
  const [fileName, setFileName] = useAtom(fileNameAtom);
  const [fileData] = useAtom(fileDataAtom);

  //query rendering 
  // useEffect(() => {
  //   const fetchGraphData = async () => {
  //     try {
  //       // Construct the query URL
  //       const queryUrl = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(query)}&format=json`;
        
  //       console.log("Fetching data from URL:", queryUrl);
  //       const response = await fetch(queryUrl, {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "User-Agent": "CityGraph",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Fetch error: ${response.statusText}`);
  //       }

  //       const result = await response.json();
  //       console.log("Received data from query:", JSON.stringify(result, null, 2));

  //       const nodes: NodeData[] = [];
  //       const links: LinkData[] = [];

  //       // Process the result data
  //       result.results.bindings.forEach((binding: any) => {
  //         const subject = binding.s.value;
  //         const predicate = binding.p.value;
  //         const object = binding.o.value;

  //         nodes.push({ id: subject, indegree: 0, outdegree: 0 });
  //         nodes.push({ id: object, indegree: 0, outdegree: 0 });
  //         links.push({ source: subject, target: object, type: predicate });
  //       });

  //       // Remove duplicate nodes
  //       const uniqueNodes = Array.from(new Set(nodes.map((node) => node.id))).map(
  //         (id) => nodes.find((node) => node.id === id)!
  //       );
  //       const uniqueLinksArray = Array.from(new Set(links.map((link) => JSON.stringify(link))));
  //       const linkTypeColors = getUniqueLinkTypesWithColors(links, uniqueLinksArray);

  //       setGraphData({ nodes: uniqueNodes, links, linkTypeColors });
  //       setLinkTypeColors(linkTypeColors);
  //     } catch (error) {
  //       console.error("Error fetching graph data:", error);
  //       // Handle the error appropriately (e.g., show an error message to the user)
  //     }
  //   };

  //   fetchGraphData();
  // }, [query, setLinkTypeColors]);




  useEffect(() => {
    const fetchGraphData = async () => {
      const fileNameWithoutExtension = fileName.split(".")[0];
      const response = await fetch(`/data/uploadFile.json`);
      const data = await response.json();

      const nodes: NodeData[] = [];
      const links: LinkData[] = [];

      data.forEach((record: { subject: string; predicate: string; object: string }) => {
        const { subject, predicate, object } = record;

        nodes.push({
          id: subject,
          indegree: 0,
          outdegree: 0,
        });

        nodes.push({
          id: object,
          indegree: 0,
          outdegree: 0,
        });

        links.push({
          source: subject,
          target: object,
          type: predicate,
        });
      });

      // Remove duplicate nodes
      const uniqueNodes = Array.from(new Set(nodes.map((node) => node.id))).map(
        (id) => nodes.find((node) => node.id === id)!
      );
      const uniqueLinksArray = Array.from(new Set(links.map((link) => JSON.stringify(link))));
      const linkTypeColors = getUniqueLinkTypesWithColors(links, uniqueLinksArray);
      setGraphData({ nodes: uniqueNodes, links, linkTypeColors });
      setLinkTypeColors(linkTypeColors);
    };

    fetchGraphData();
  }, [fileName, setLinkTypeColors]);

  useEffect(() => {
    if (graphData) {
      // Memoize createGraph call
      const newGraph = createGraph(graphData.nodes, graphData.links); // createGraph itself is not expensive enough to warrant useMemo here for the function definition
      setGlobalGraph(newGraph); 
      
      // Call setDegree - Note: setDegree mutates graphData.nodes. This is not ideal for React.
      // For this task, we keep it as is, but a refactor for immutability would be better.
      setDegree(graphData); 

      const initialEnabledLinkTypes = Object.keys(graphData.linkTypeColors).reduce((acc, type) => {
        acc[type] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setEnabledLinkTypes(initialEnabledLinkTypes);
      // Initial filtering is done here, subsequent filtering based on linkTypes is in another useEffect
      // setFilteredLinks(graphData.links); // This will be handled by the memoized filteredGraphData
      // setFilteredNodes(graphData.nodes); // This will be handled by the memoized filteredGraphData
    }
  }, [graphData, setGlobalGraph]); // setDegree is not added as a dep as it's a stable function but mutates graphData

  const filteredGraphData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };

    const currentFilteredLinks = linkTypes.length
      ? graphData.links.filter((link) => linkTypes.some((type) => type.name === link.type && type.selected))
      : graphData.links;

    const connectedNodeIds = new Set<string>();
    currentFilteredLinks.forEach((link) => {
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    });

    const currentFilteredNodes = graphData.nodes.filter((node) => connectedNodeIds.has(node.id));
    
    return { nodes: currentFilteredNodes, links: currentFilteredLinks };
  }, [graphData, linkTypes]);
  
  // Update state based on memoized filtered data
  useEffect(() => {
    setFilteredNodes(filteredGraphData.nodes);
    setFilteredLinks(filteredGraphData.links);
  }, [filteredGraphData]);


  const onCosmographClick = React.useCallback<Exclude<CosmographInputConfig<NodeData, LinkData>["onClick"], undefined>>(
    (n) => {
      if (isHistoryEnabled) {
        if (n) {
          let neighbors: NodeData[] = [n];
          globalGraph.forEachNeighbor(n.id, (neighbor, attributes) => {
            neighbors.push({
              id: neighbor,
              indegree: 0,
              outdegree: 0,
            });
          });
          const updatedVisitedNodes = new Set(visitedNodes);
          neighbors.forEach((node) => updatedVisitedNodes.add(node));
          cosmographRef.current?.selectNodes([...updatedVisitedNodes] as any);
          setActiveTab("info");
          setShowLabelsFor([n]);
          setVisitedNodes(updatedVisitedNodes);
          setSelectedNode(n);
        } else {
          cosmographRef.current?.unselectNodes();
          setActiveTab("general");
          setShowLabelsFor(undefined);
          setSelectedNode(undefined);
          visitedNodes.clear();
        }
      } else {
        if (n) {
          let neighbors: NodeData[] = [n];
          globalGraph.forEachNeighbor(n.id, (neighbor, attributes) => {
            neighbors.push({
              id: neighbor,
              indegree: 0,
              outdegree: 0,
            });
          });
          const updatedVisitedNodes = new Set(visitedNodes);
          cosmographRef.current?.selectNodes([...neighbors] as any);

          setActiveTab("info");
          setShowLabelsFor([n]);
          setSelectedNode(n);
        } else {
          cosmographRef.current?.unselectNodes();
          setActiveTab("general");
          setShowLabelsFor(undefined);
          setSelectedNode(undefined);
        }
      }
    },
    [globalGraph, visitedNodes, isHistoryEnabled]
  );

  const setDegree = (graphData: { nodes: NodeData[]; links: LinkData[]; linkTypeColors: Record<string, string> } | null) => {
    graphData.nodes.forEach((node) => {
      let indegree = 0;
      let outdegree = 0;
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
  };

  const memoizedCalculateNodeSize = useMemo(() => {
    if (!graphData) return () => minNodeSize * nodeScale[0]; // Default size if no graphData
    const total = Math.sqrt(graphData.links.length || 1);
    const scaleSize = (size: number) => Math.min(maxNodeSize, Math.max(minNodeSize, size));
  
    switch (nodeSize) {
      case "total":
        return (n: NodeData) => {
          const size = ((n.indegree + n.outdegree) / total) * 30 * nodeScale[0] + 1;
          return scaleSize(size);
        };
      case "incoming":
        return (n: NodeData) => {
          const size = (n.indegree / total) * 10 * nodeScale[0] + 1;
          return scaleSize(size);
        };
      case "outgoing":
        return (n: NodeData) => {
          const size = (n.outdegree / total) * 10 * nodeScale[0] + 1;
          return scaleSize(size);
        };
      default:
        return () => minNodeSize * nodeScale[0];
    }
  }, [graphData, nodeSize, nodeScale]);
  
  const memoizedCalculateNodeSizeForCol = useMemo(() => {
    if (!graphData) return () => minNodeSize * nodeScale[0]; // Default size if no graphData
    const total = Math.sqrt(graphData.links.length || 1);
  
    switch (nodeColor) {
      case "total":
        return (n: NodeData) => ((n.indegree + n.outdegree) / total) * 30 * nodeScale[0] + 1;
      case "incoming":
        return (n: NodeData) => (n.indegree / total) * 10 * nodeScale[0] + 1;
      case "outgoing":
        return (n: NodeData) => (n.outdegree / total) * 10 * nodeScale[0] + 1;
      default:
        return () => minNodeSize * nodeScale[0];
    }
  }, [graphData, nodeColor, nodeScale]);
  
  const memoizedCalculateColorSize = useMemo(() => {
    if (!graphData) return () => "#FFC0CB"; // Default color if no graphData
    const getNodeSize = memoizedCalculateNodeSizeForCol;
    const colors = [
      "#FFC0CB", // Light pink
      "#FF69B4",
      "#FF1493",
      "#DB7093",
    ];
    // Calculate maxNodeSize based on the current graphData and nodeColor selection
    // This needs to be inside the useMemo as it depends on graphData
    const allNodeSizes = graphData.nodes.map(n => getNodeSize(n));
    const maxNodeSizeVal = Math.max(...allNodeSizes, minNodeSize); // ensure maxNodeSizeVal is at least minNodeSize
  
    return (node: NodeData) => {
      const size = getNodeSize(node);
      let colorIndex;
      // Check against minNodeSize directly if that's the default/fallback size from getNodeSize
      if (size > (minNodeSize * nodeScale[0]) && maxNodeSizeVal > (minNodeSize * nodeScale[0])) { // Check if size is greater than default and max is greater than default
        colorIndex = Math.floor(((size - (minNodeSize * nodeScale[0])) / (maxNodeSizeVal - (minNodeSize * nodeScale[0]))) * (colors.length - 1));
        colorIndex = Math.max(0, Math.min(colorIndex, colors.length - 1)); // Clamp index
      } else {
        colorIndex = 0; // Default to the first color if size is minimal or maxNodeSizeVal is minimal
      }
      return colors[colorIndex];
    };
  }, [graphData, nodeColor, nodeScale, memoizedCalculateNodeSizeForCol]);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getUniqueLinkTypesWithColors = (links: LinkData[], uniqueLinksArray: LinkType[]) => {
    const linkTypeColors: Record<string, string> = {};
    links.forEach((link) => {
      if (!linkTypeColors[link.type]) {
        linkTypeColors[link.type] = generateRandomColor();
        // uniqueLinksArray.push({ type: link.type }); // This function is called during data fetching, uniqueLinksArray might not be what we expect here
      }
    });
    return linkTypeColors;
  };
  
  const memoizedGetLinkColor = useMemo(() => {
    if (!graphData) return () => "#000000"; // Default color if no graphData
    return (link: LinkData) => graphData.linkTypeColors[link.type] || "#000000";
  }, [graphData]);

  const themeToUse = theme === "dark" ? "#030014" : "#fafafa";

  if (!graphData) {
    return (
      <div className="flex items-center justify-center bg-white dark:bg-brand-dark w-[99.5vw] h-[98vh]">
        <div>Loading Kosmograph...</div>
      </div>
    );
  }
  return (
    <div className={clsx("flex items-center justify-center bg-white dark:bg-brand-dark w-[99.5vw] h-[98vh]")}>
      <CosmographProvider>
        <Cosmograph
          ref={cosmographRef}
          nodes={filteredGraphData.nodes} // Use memoized nodes
          links={filteredGraphData.links} // Use memoized links
          backgroundColor={themeToUse}
          nodeColor={memoizedCalculateColorSize} // Use memoized function
          nodeSize={memoizedCalculateNodeSize} // Use memoized function
          linkWidth={1}
          linkColor={memoizedGetLinkColor} // Use memoized function
          linkArrowsSizeScale={isDirected ? 1 : 0}
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
          simulationFriction={0.85}      // Adjusted parameter
          simulationLinkSpring={0.5}
          simulationLinkDistance={18}
          simulationRepulsionFromMouse={5.0}
          onClick={onCosmographClick}
          nodeSamplingDistance={10.0}
          simulationRepulsion={0.2}       // Adjusted parameter
          linkVisibilityMinTransparency={1}
        />
      </CosmographProvider>
    </div>
  );
}

export default GraphViz;
