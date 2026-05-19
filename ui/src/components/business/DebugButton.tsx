import { useAppStore } from "@/store/useAppStore";
import { IconBug, IconBugOff, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDebugStore } from "@/store/useDebugStore";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SimpleLog } from "./SimpleLog";
import { useState } from 'react';

export function DebugButton() {
    const { debug, setDebug } = useAppStore();
    const { debugs } = useDebugStore();

    const toggleDebug = () => {
        setDebug(!debug);
    }

    const [name, setName] = useState<string>("");

    const toggleName = (open: boolean, key: string) => {
        if (open) {
            setName(key);
        } else {
            setName("");
        }
    }

    return (
        <Drawer direction="right" open={debug} onOpenChange={setDebug}>
            <DrawerTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon-sm" onClick={toggleDebug}>
                            {debug ? <IconBug /> : <IconBugOff />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Show debug info
                    </TooltipContent>
                </Tooltip>
            </DrawerTrigger>
            <DrawerContent>
                <ScrollArea className="h-full overflow-auto">
                    {Object.entries(debugs).map(([key, values]) => (
                        <Collapsible key={key} className="border rounded-md w-full" open={name === key} onOpenChange={(open) => toggleName(open, key)}>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full flex justify-between">
                                    {key}
                                    {name !== key ? (
                                        <IconChevronRight stroke={2} />
                                    ) : (
                                        <IconChevronDown stroke={2} />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <ScrollArea>
                                    {values.map((value) => (
                                        <SimpleLog level="" message={value} className="select-text" />
                                    ))}
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </ScrollArea>
            </DrawerContent>
        </Drawer>

    )
}