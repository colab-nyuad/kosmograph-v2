// @ts-nocheck

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import {
    linkTypeColorsAtom,
    selectedLinkTypeAtom,
	LinkTypesSelctionAtom,
} from "./atoms/store";
import { useAtom } from "jotai";
import { ColorPicker, useColor } from "react-color-palette";

const getLinks = () => {
    const [linkTypeColors, setLinkTypeColors] = useAtom(linkTypeColorsAtom);
    const linkTypes = linkTypeColors;
    console.log("link types:", linkTypes);
}

export function LinkTypes() {
    const [linkTypeColors] = useAtom(linkTypeColorsAtom);
    const [selectedLinkType, setSelectedLinkType] = useAtom(selectedLinkTypeAtom);
    //console.log("link types here:", linkTypeColors);
    const [color, setColor] = useColor("hex", "#121212");
	const [linkTypes, setLinkTypes] = useAtom(LinkTypesSelctionAtom);

    const convertLinkTypeColorsToArray = (colors: Record<string, string>) => {
        const sortedColors = Object.entries(colors).sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
        return sortedColors.map(([name, color]) => ({ name, color }));
    };

    const linkTypeColorsArray = convertLinkTypeColorsToArray(linkTypeColors);

    // Reset selected link type
    const resetGraph = () => {
        setSelectedLinkType(null);
		setLinkTypes([]);
    };

    return (
        <AccordionItem value="item-3">
            <AccordionTrigger className="opacity-70 hover:opacity-100">
                Link Types
            </AccordionTrigger>
            <AccordionContent>
                <ScrollArea className="h-72 w-full rounded-md border bg-neutral-300 dark:bg-neutral-700">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">
                            Link types
                        </h4>
                        {linkTypeColorsArray.map(({ name, color }, index) => (
                            
						<React.Fragment key={index}>
							<div className="text-sm flex items-center mb-2">
								<input
									type="checkbox"
									id={name}
									name="linkType"
									value={name}
									checked={linkTypes.some(link => link.name === name)}
									onChange={() => {
										console.log(`Clicked ${name}`);
										if (linkTypes.some(link => link.name === name)) {
											setLinkTypes(prev => prev.filter(link => link.name !== name));
										} else {
											setLinkTypes(prev => [...prev, { name, color }]);
										}
										console.log("selected link types:", linkTypes);
									}}
									className="mr-2"
								/>
								<label htmlFor={name} style={{ color }}>
									{name}: {color}
								</label>
							</div>
							<Separator className="my-2" />
						</React.Fragment>



                        ))}
                    </div>
                </ScrollArea>
                <button
                    onClick={resetGraph}
                    style={{ display: "flex", justifyContent: "center", margin: "auto" }}
                    className="mt-4 p-2 bg-white-500 text-red rounded-md"
                >
                    Reset Links
                </button>
            </AccordionContent>
        </AccordionItem>
    );
}
