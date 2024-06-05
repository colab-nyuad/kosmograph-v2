import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";

interface LinkTypesProps {
    linkTypes: Record<string, string>;
    onToggle: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const LinkTypes: React.FC<LinkTypesProps> = ({ linkTypes = {}, onToggle }) => { // Default to an empty object
    return (
        <AccordionItem value="item-3">
            <AccordionTrigger className="opacity-70 hover:opacity-100">
                Link Types
            </AccordionTrigger>
            <AccordionContent>
                <ScrollArea className="h-72 w-full rounded-md border bg-neutral-300 dark:bg-neutral-700">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">
                            Link Types
                        </h4>
                        {Object.keys(linkTypes).map((type) => (
                            <React.Fragment key={type}>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={type}
                                        onChange={(e) => onToggle((prev) => ({ ...prev, [type]: e.target.checked }))}
                                    />
                                    <label htmlFor={type} style={{ color: linkTypes[type] }} className="ml-2 text-sm">
                                        {type}
                                    </label>
                                </div>
                                <Separator className="my-2" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </AccordionContent>
        </AccordionItem>
    );
};