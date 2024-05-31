// // @ts-nocheck 
// import * as React from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import {
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "../ui/accordion";
// import { GraphData } from "./hooks/useGraphData";

// export function LinkTypes() {
// 	const { linkTypes } = React.useContext(GraphData.lin);
//     return (
//         <AccordionItem value="item-3">
//             <AccordionTrigger className="opacity-70 hover:opacity-100">
//                 Link Types
//             </AccordionTrigger>
//             <AccordionContent>
//                 <ScrollArea className="h-72 w-full rounded-md border bg-neutral-300 dark:bg-neutral-700">
//                     <div className="p-4">
//                         <h4 className="mb-4 text-sm font-medium leading-none">
//                             Link type
//                         </h4>
//                         {Object.keys(linkTypes).map((type) => (
//                             <React.Fragment key={type}>
//                                 <div
//                                     style={{ color: linkTypes[type] }}
//                                     className="text-sm flex items-center mb-2"
//                                 >
//                                     {type}
//                                 </div>
//                                 <Separator className="my-2" />
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </ScrollArea>
//             </AccordionContent>
//         </AccordionItem>
//     );
// }

import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

// function to generate random color for the tags
const getRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

const tags = Array.from({ length: 50 }).map((_, i, a) => [
	`link-alpha-gamma.${a.length - i}`,
	getRandomColor(),
]);

export function LinkTypes() {
	const randomColor = getRandomColor();

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
						{tags.map((tag) => (
							<React.Fragment key={tag[0]}>
								<div
									style={{ color: tag[1] }}
									className={`text-sm  flex items-center mb-2`}
								>
									{tag[0]}
								</div>
								<Separator className="my-2" />
							</React.Fragment>
						))}
					</div>
				</ScrollArea>
			</AccordionContent>
		</AccordionItem>
	);
}
