//@ts-nocheck
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
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
import { Switch } from "../../ui/switch";
import ToolTip from "../toolTip";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { isDirectedAtom, linkColorAtom, linkSizeAtom } from "../atoms/store";

const SidebarLinkTab = () => {
  const [linkSliderVal, setLinkSliderVal] = React.useState([1]);
  const [isDirected, setIsDirected] = useAtom(isDirectedAtom);
  const [linkSwitchChecked, setLinkSwitchChecked] = React.useState(false);
  const [linkColor, setLinkColor] = useAtom(linkColorAtom);
  const [linkSize, setLinkSize] = useAtom(linkSizeAtom);

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="opacity-70 hover:opacity-100">
        Link Appearance
      </AccordionTrigger>
      <AccordionContent>
        <div className="bg-neutral-300 dark:bg-neutral-700 rounded px-1 ">
          <Select value={linkSize} onValueChange={setLinkSize}>
            <SelectTrigger className="w-full opacity-85 h-[55px] my-2 bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
              <div className="flex flex-col p-0 m-0">
                <ToolTip heading="link size by " text={NODE_SIZE_DESC} />
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
          <Select value={linkColor} onValueChange={setLinkColor}>
            <SelectTrigger className="w-full opacity-85 h-[55px] bg-neutral-300 dark:bg-neutral-700 border-none hover:opacity-100">
              <div className="flex flex-col p-0 m-0">
                <ToolTip heading="link color by " text={NODE_SIZE_DESC} />
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
            <div className="flex flex-row items-center justify-between my-2">
              <span className="text-sm">
                Link Scale:{" "}
                <div className="inline-block p-0 m-0 align-baseline">
                  <ToolTip heading="" text={NODE_SIZE_DESC} />
                </div>
              </span>
              <span>{linkSliderVal[0]}</span>
            </div>
            <Slider
              max={5}
              step={0.1}
              value={linkSliderVal}
              onValueChange={(val: React.SetStateAction<number[]>) => {
                setLinkSliderVal(val);
              }}
            />
          </div>
          <Separator className="mt-3" />
          <div className="flex flex-row h-[50px] mt-4 items-center justify-between px-3 opacity-85 hover:opacity-100">
            <Button onClick={() => setIsDirected(!isDirected)} className="w-full">
              {isDirected ? "Show Link Directions" : "Hide Link Directions"}
            </Button>
          </div>
          <Separator className="mt-3" />
          <div className="flex flex-row h-[50px] mt-2 items-center justify-between px-3 opacity-85 hover:opacity-100">
            <span>
              Show Links{" "}
              <div className="inline-block p-0">
                <ToolTip heading="" text={NODE_SIZE_DESC} />
              </div>
            </span>
            <span>
              <Switch
                checked={linkSwitchChecked}
                onCheckedChange={(val) => {
                  setLinkSwitchChecked(val);
                }}
              />
            </span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SidebarLinkTab;
