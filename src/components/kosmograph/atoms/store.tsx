import Graph from "graphology";
import { atom } from "jotai";
import { LinkData, NodeData } from "../hooks/useGraphData";

const initialGraph = new Graph();
const globalGraphAtom = atom(initialGraph);

const showNodeLabelsAtom = atom(true);
const nodeScaleAtom = atom([1]);
const nodeSizeAtom = atom("default");
const nodeColorAtom = atom("default");
const activeTabAtom = atom("general");
const numberOfNeighborsAtom = atom(1);
const selectedNodeAtom = atom<NodeData | undefined>(undefined);
const selectedLinkTypesAtom = atom<string[]>([]);
const isDirectedAtom = atom(true);
const visitedNodesAtom = atom<NodeData[]>([]);

export {
    activeTabAtom,
    globalGraphAtom,
    nodeColorAtom,
    nodeScaleAtom,
    nodeSizeAtom,
    numberOfNeighborsAtom,
    selectedNodeAtom,
    showNodeLabelsAtom,
    selectedLinkTypesAtom,
    isDirectedAtom,
    visitedNodesAtom
};