import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
		<ScrollArea className="h-72 w-full rounded-md border bg-neutral-300 dark:bg-neutral-700">
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium leading-none">Link types</h4>
				{tags.map((tag) => (
					<>
						<div
							key={tag[0]}
							style={{ color: tag[1] }}
							className={`text-sm  flex items-center mb-2`}
						>
							{tag[0]}
						</div>
						<Separator className="my-2" />
					</>
				))}
			</div>
		</ScrollArea>
	);
}
