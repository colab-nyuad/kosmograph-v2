// @ts-nocheck

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    linkTypeColorsAtom,
    selectedLinkTypeAtom,
    LinkTypesSelctionAtom,
} from "./atoms/store";
import { useAtom } from "jotai";
import { SketchPicker } from "react-color";

export function LinkTypes() {
    const [linkTypeColors, setLinkTypeColors] = useAtom(linkTypeColorsAtom);
    const [selectedLinkType, setSelectedLinkType] = useAtom(selectedLinkTypeAtom);
    const [color, setColor] = React.useState("#121212");
    const [linkTypes, setLinkTypes] = useAtom(LinkTypesSelctionAtom);
    const [activeLinkType, setActiveLinkType] = React.useState(null);

    const convertLinkTypeColorsToArray = (colors: Record<string, string>) => {
        const sortedColors = Object.entries(colors).sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
        return sortedColors.map(([name, color]) => ({ name, color }));
    };

    const linkTypeColorsArray = convertLinkTypeColorsToArray(linkTypeColors);

    // Reset selected link type
    const resetGraph = () => {
        setSelectedLinkType(null);
        setLinkTypes([]);
        setActiveLinkType(null);
    };

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        if (activeLinkType) {
            setLinkTypeColors((prevColors) => ({
                ...prevColors,
                [activeLinkType]: newColor.hex,
            }));
            console.log(`Updated color for ${activeLinkType} to ${newColor.hex}`);
        }
    };

    const handleCheckboxChange = (name, color) => {
        if (linkTypes.some((link) => link.name === name)) {
            setLinkTypes((prev) => prev.filter((link) => link.name !== name));
            if (activeLinkType === name) {
                setActiveLinkType(null);
            }
        } else {
            setLinkTypes((prev) => [...prev, { name, color }]);
            setActiveLinkType(name);
            setColor(color);
        }
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
                                        checked={linkTypes.some((link) => link.name === name)}
                                        onChange={() => handleCheckboxChange(name, color)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={name} style={{ color }}>
                                        {name}: {color}
                                        {/* test */}
                                    </label>
                                </div>
                                {activeLinkType === name && (
                                    <div className="mb-4">
                                        <SketchPicker
                                            color={color}
                                            onChangeComplete={(newColor) => handleColorChange(newColor)}
                                        />
                                    </div>
                                )}
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