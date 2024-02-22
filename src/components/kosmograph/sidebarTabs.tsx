import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

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
import { Switch } from "../ui/switch";
import { LinkTypes } from "./linkTypes";
import ToolTip from "./toolTip";

const SidebarTabs = () => {
	const [activeTab, setActiveTab] = React.useState("general");
	const [nodeSliderVal, setNodeSliderVal] = React.useState([1]);
	const [linkSliderVal, setLinkSliderVal] = React.useState([1]);
	const [nodeSwitchChecked, setNodeSwitchChecked] = React.useState(false);
	const [linkSwitchChecked, setLinkSwitchChecked] = React.useState(false);

	// Pass this function to the node click even to navigate to the info tab
	const navigateToTab = (tabValue: React.SetStateAction<string>) => {
		setActiveTab(tabValue);
	};
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			{/* <div className="flex items-center justify-between"> */}
			<Link href="/kosmograph">
				<span className="text-m font-bold pr-3">KG</span>
			</Link>
			{/* </div> */}
			<TabsList>
				<TabsTrigger value="general">General</TabsTrigger>
				<TabsTrigger value="info">Info</TabsTrigger>
			</TabsList>
			<TabsContent value="general">
				<div className="flex-1">
					<ul className="pt-2 pb-4 space-y-1 text-sm">
						<Accordion type="multiple">
							<AccordionItem value="node-appearance">
								<AccordionTrigger className="opacity-70 hover:opacity-100">
									Node Appearance
								</AccordionTrigger>
								<AccordionContent>
									<div className="bg-neutral-300 dark:bg-neutral-700 rounded px-1 ">
										<Select>
											<SelectTrigger className="w-full opacity-85 h-[55px] my-2 bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
												<div className="flex flex-col p-0 m-0">
													<ToolTip
														heading="node size by "
														text={NODE_SIZE_DESC}
													/>
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
										<Select>
											<SelectTrigger className="w-full opacity-85 h-[55px] bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
												<div className="flex flex-col p-0 m-0">
													<ToolTip
														heading="node color by "
														text={NODE_SIZE_DESC}
													/>
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
												onValueChange={(
													val: React.SetStateAction<number[]>
												) => {
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
									</div>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger className="opacity-70 hover:opacity-100">
									Link Appearance
								</AccordionTrigger>
								<AccordionContent>
									<div className="bg-neutral-300 dark:bg-neutral-700 rounded px-1 ">
										<Select>
											<SelectTrigger className="w-full opacity-85 h-[55px] my-2 bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
												<div className="flex flex-col p-0 m-0">
													<ToolTip
														heading="link size by "
														text={NODE_SIZE_DESC}
													/>
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
										<Select>
											<SelectTrigger className="w-full opacity-85 h-[55px] bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
												<div className="flex flex-col p-0 m-0">
													<ToolTip
														heading="link color by "
														text={NODE_SIZE_DESC}
													/>
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
													Link Scale:{" "}
													<div className="inline-block p-0 m-0 align-baseline">
														<ToolTip heading="" text={NODE_SIZE_DESC} />
													</div>
												</span>
												<span>{linkSliderVal[0]} </span>
											</div>
											<Slider
												max={5}
												step={0.1}
												value={linkSliderVal}
												onValueChange={(
													val: React.SetStateAction<number[]>
												) => {
													setLinkSliderVal(val);
												}}
											/>
										</div>
										<Separator className="mt-3" />

										<div className="flex flex-row h-[50px] mt-2 items-center justify-between px-3 opacity-85 hover:opacity-100">
											<span>
												Show Links{" "}
												<div className="inline-block p-0">
													<ToolTip heading="" text={NODE_SIZE_DESC} />
												</div>
											</span>
											<span className="">
												<Switch
													checked={linkSwitchChecked}
													onCheckedChange={(val) => {
														setLinkSwitchChecked(val);
													}}
												/>{" "}
											</span>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger className="opacity-70 hover:opacity-100">
									Link Types
								</AccordionTrigger>
								<AccordionContent>
									<LinkTypes />
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</ul>
				</div>
			</TabsContent>
			<TabsContent value="info">Info about specific Node</TabsContent>
		</Tabs>
	);
};

export default SidebarTabs;
