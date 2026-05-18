import { useAppStore } from "@/store/useAppStore";
import { useLogStore } from "@/store/useLogStore";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CopyButton } from "./CopyButton";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { CardLogs } from "./CardLogs";
import { ComposeLogs } from "./ComposeLogs";
import { useEffect, useMemo, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { IconLineDashed, IconPalette, IconPaletteOff, IconTallymark1 } from "@tabler/icons-react";

export function MixedLogsCard() {
    const { direction, setDirection, colorful, setColorful } = useAppStore();

    const toggleColorful = () => {
        setColorful(!colorful);
    }

    const { messageComposes } = useLogStore();

    const defaultIndex = useMemo<number>(() => {
        for (let i = 0; i < messageComposes.length; i++) {
            if (messageComposes[i].logs && messageComposes[i].logs.length > 0) {
                return i;
            }
        }
        return -1;
    }, [messageComposes]);

    const [activeTab, setActiveTab] = useState<number>(defaultIndex);

    useEffect(() => {
        setActiveTab(defaultIndex);
    }, [defaultIndex]);

    return (
        <Card className="flex-none border p-2 relative">

            <CardHeader className="sticky top-0 z-[3] ">
                <div className="flex h-[41.5px] items-center">
                    <div>
                        {direction === "tabs" && activeTab >= 0 && (
                            <ButtonGroup>
                                <Button variant="outline" size="sm">{`${messageComposes[activeTab].stream}<${messageComposes[activeTab].logs?.length || 0}>`}</Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon-sm">
                                            <MoreHorizontalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full" align="start">
                                        {messageComposes.map((messageCompose, index) => (
                                            <DropdownMenuItem key={index} onClick={() => setActiveTab(index)} disabled={!messageCompose.logs || messageCompose.logs?.length === 0}>
                                                {`${messageCompose.stream}<${messageCompose.logs?.length || 0}>`}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={toggleColorful}>
                                    {colorful ? <IconPalette /> : <IconPaletteOff />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Colorful mode for WARN and ERROR levels
                            </TooltipContent>
                        </Tooltip>

                        <CopyButton />

                        <ToggleGroup type="single" orientation="horizontal" variant="outline" size="sm" value={direction} onValueChange={setDirection}>
                            <ToggleGroupItem value="tabs">
                                <IconLineDashed />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="line">
                                <IconTallymark1 />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {direction === "tabs" && activeTab >= 0 ? (
                    <CardLogs logs={messageComposes[activeTab]?.logs} />
                ) : (
                    <ComposeLogs />
                )}

            </CardContent>
        </Card>
    )
}