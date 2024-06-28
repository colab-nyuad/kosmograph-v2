
import Graph from "graphology";
import { atom } from "jotai";
import { LinkData, NodeData } from "../hooks/useGraphData";
import { atomWithLocalStorage } from "../utils/localStorageAtom";
import React from "react";

const initialGraph = new Graph();
const globalGraphAtom = atom(initialGraph);

const isDirectedAtom = atom(true);
const showNodeLabelsAtom = atom(true);
const nodeScaleAtom = atom([1]);
const nodeSizeAtom = atom("default");
const nodeColorAtom = atom("default");
const activeTabAtom = atom("general");
const numberOfNeighborsAtom = atom(1);
const linkTypeColorsAtom = atom<Record<string, string>>({});
const selectedNodeAtom = atom<NodeData | undefined>(undefined);
const selectedLinkTypeAtom = atom<LinkData | undefined>(undefined);
const LinkTypesSelctionAtom = atom<string[]>([]);
const isHistoryEnabledAtom = atom(true);
const fileNameAtom = atomWithLocalStorage('fileName', "uploadFile.json");
const fileDataAtom = atom<Record<string, any>>({});
const linkColorAtom = atom("default");
const linkSizeAtom = atom("default");
//review color set atom
//const colorSetAtom = React.useState("#121212");
const queryAtom = atom<string>('');

export {
  queryAtom,
	
  isDirectedAtom,
  fileDataAtom,
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
  linkColorAtom,
  linkSizeAtom,
  //colorSetAtom,
};
