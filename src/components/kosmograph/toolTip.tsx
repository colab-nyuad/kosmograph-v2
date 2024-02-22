import React from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface ToolTipProps {
	heading: string;
	text: string[];
}
const ToolTip: React.FC<ToolTipProps> = ({ heading, text }) => {
	return (
		<div className="inline">
			<div className="flex flex-row text-muted text-xs">
				<p>{heading}</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<HelpCircle size={18} />
						</TooltipTrigger>
						<TooltipContent side="right">
							<ScrollArea className="w-80 h-32 text-xs text-wrap text-left">
								{text.map((txt, i) => (
									<>
										<span key={i}>
											<strong>{txt.split(":")[0]}:</strong>
											{txt.split(":")[1]}
										</span>
										<br />
									</>
								))}
							</ScrollArea>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default ToolTip;
