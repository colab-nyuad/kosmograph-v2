import Graph from "graphology";
import { atom } from "jotai";
import { LinkData, NodeData } from "../hooks/useGraphData";
import { boolean, string } from "zod";


const initialGraph = new Graph();
const globalGraphAtom = atom(initialGraph);

const showNodeLabelsAtom = atom(true);
const nodeScaleAtom = atom([1]);
const nodeSizeAtom = atom("default");
const nodeColorAtom = atom("default");
const activeTabAtom = atom("general");
const numberOfNeighborsAtom = atom(1);
const linkTypeColorsAtom = atom<Record<string, string>>({})
const selectedNodeAtom = atom<NodeData | undefined>(undefined);
const selectedLinkTypeAtom = atom<LinkData | undefined>(undefined);
const LinkTypesSelctionAtom = atom<string[]>([]);
const isHistoryEnabledAtom = atom(true);
const fileNameAtom = atom(" ");
export {
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
};
