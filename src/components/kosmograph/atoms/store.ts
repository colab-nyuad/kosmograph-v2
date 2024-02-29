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
const numberOfNodeLabels = atom(3);
const selectedNodeAtom = atom<NodeData | undefined>(undefined);
export {
	activeTabAtom,
	globalGraphAtom,
	nodeColorAtom,
	nodeScaleAtom,
	nodeSizeAtom,
	numberOfNodeLabels,
	selectedNodeAtom,
	showNodeLabelsAtom,
};
