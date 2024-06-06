import React from "react";
import { useAtom } from "jotai";
import { additionalVisitedNodesAtom } from "../atoms/store";
import { NodeData } from "../hooks/useGraphData";

const SidebarExploreTab = () => {
    const [additionalVisitedNodes] = useAtom<NodeData[]>(additionalVisitedNodesAtom);

    return (
        <div className="bg-neutral-300 dark:bg-neutral-700 rounded px-1 py-2">
            <h3 className="text-lg font-bold mb-2">Visited Nodes</h3>
            <ul className="space-y-1">
                {additionalVisitedNodes.length > 0 ? (
                    additionalVisitedNodes.map((node, index) => (
                        <li key={index} className="text-sm text-slate-700 dark:text-slate-300">
                            {node.id}
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-slate-700 dark:text-slate-300">No nodes visited yet.</li>
                )}
            </ul>
        </div>
    );
};

export default SidebarExploreTab;