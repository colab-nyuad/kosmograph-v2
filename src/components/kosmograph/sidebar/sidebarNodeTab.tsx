import React from "react";

import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../ui/accordion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { NODE_SIZE_DESC } from "@/lib/constants";
import { useAtom } from "jotai";
import { useDebounce } from "use-debounce";
import { Switch } from "../../ui/switch";
import {
	nodeColorAtom,
	nodeScaleAtom,
	nodeSizeAtom,
	numberOfNodeLabels,
	showNodeLabelsAtom,
} from "../atoms/store";
import ToolTip from "../toolTip";

const SidebarNodeTab = () => {
	const [nodeSliderVal, setNodeSliderVal] = useAtom(nodeScaleAtom);
	const [nodeSwitchChecked, setNodeSwitchChecked] = useAtom(showNodeLabelsAtom);
	const [nodeSize, setNodeSize] = useAtom(nodeSizeAtom);
	const [nodeColor, setNodeColor] = useAtom(nodeColorAtom);
	const [numberLabels, setNumberLabels] = useAtom(numberOfNodeLabels);
	const [debouncedValue] = useDebounce(numberLabels, 500);

	// @ts-ignore
	const handleInputChange = (event) => {
		setNumberLabels(event.target.value);
	};

	return (
		<AccordionItem value="node-appearance">
			<AccordionTrigger className="opacity-70 hover:opacity-100">
				Node Appearance
			</AccordionTrigger>
			<AccordionContent>
				<div className="bg-neutral-300 dark:bg-neutral-700 rounded px-1 ">
					<Select value={nodeSize} onValueChange={setNodeSize}>
						<SelectTrigger className="w-full opacity-85 h-[55px] my-2 bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
							<div className="flex flex-col p-0 m-0">
								<ToolTip heading="node size by " text={NODE_SIZE_DESC} />
								<SelectValue placeholder="default" />
							</div>
						</SelectTrigger>
						<SelectContent className="bg-neutral-200 dark:bg-neutral-800">
							<SelectItem value="default">default</SelectItem>
							<SelectItem value="total">total links</SelectItem>
							<SelectItem value="incoming">incoming links</SelectItem>
							<SelectItem value="outgoing">outgoing links</SelectItem>
						</SelectContent>
					</Select>
					<Separator />
					<Select value={nodeColor} onValueChange={setNodeColor}>
						<SelectTrigger className="w-full opacity-85 h-[55px] bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
							<div className="flex flex-col p-0 m-0">
								<ToolTip heading="node color by " text={NODE_SIZE_DESC} />
								<SelectValue placeholder="default" />
							</div>
						</SelectTrigger>
						<SelectContent className="bg-neutral-200 dark:bg-neutral-800">
							<SelectItem value="default">default</SelectItem>
							<SelectItem value="total">total links</SelectItem>
							<SelectItem value="incoming">incoming links</SelectItem>
							<SelectItem value="outgoing">outgoing links</SelectItem>
						</SelectContent>
					</Select>
					<Separator />

					<div className="h-[55px] pt-2 px-3 opacity-85 hover:opacity-100">
						<div className="flex flex-row itmes-center justify-between my-2">
							<span className="text-sm">
								Node Scale:{" "}
								<div className="inline-block p-0 m-0 align-baseline">
									<ToolTip heading="" text={NODE_SIZE_DESC} />
								</div>
							</span>
							<span>{nodeSliderVal[0]} </span>
						</div>
						<Slider
							max={5}
							step={0.1}
							value={nodeSliderVal}
							onValueChange={(val: React.SetStateAction<number[]>) => {
								setNodeSliderVal(val);
							}}
						/>
					</div>
					<Separator className="mt-3" />

					<div className="flex flex-row h-[50px] mt-2 items-center justify-between px-3 opacity-85 hover:opacity-100">
						<span>
							Show Labels{" "}
							<div className="inline-block p-0">
								<ToolTip heading="" text={NODE_SIZE_DESC} />
							</div>
						</span>
						<span className="">
							<Switch
								checked={nodeSwitchChecked}
								onCheckedChange={(val) => {
									setNodeSwitchChecked(val);
								}}
							/>{" "}
						</span>
					</div>

					<Separator className="mt-3" />

					<div className="flex flex-row h-[50px] mt-2 items-center justify-between px-3 opacity-85 hover:opacity-100">
						<span>
							Labels for # Nodes{" "}
							<div className="inline-block p-0">
								<ToolTip heading="" text={NODE_SIZE_DESC} />
							</div>
						</span>
						<span className="w-16">
							<Input
								type="number"
								id="num"
								min="0"
								// placeholder={numberLabels.toString()}
								value={numberLabels}
								onChange={handleInputChange}
							/>
						</span>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

export default SidebarNodeTab;
