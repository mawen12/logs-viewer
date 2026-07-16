import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { MessageCompose } from "@/types/log";

export type DataType = MessageCompose

export interface DataButtonGroupProps {
    data: DataType[],
    active: number,
    setActive: (active: number) => void,
    desc: (dataType: DataType) => string,
    isDisabled: (dataType: DataType) => boolean
}

export function DataButtonGroup({ data, active, setActive, desc, isDisabled }: DataButtonGroupProps) {

    if (active < 0) {
        return null;
    }

    return (
        <ButtonGroup>
            <Button variant="outline" size="sm">
                {desc(data[active])}
            </Button>
            {data.length && data.length > 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon-sm">
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="start">
                        {data.map((dataType, index) => {
                            if (index === active) {
                                return null;
                            }

                            return (
                                <DropdownMenuItem key={index} onClick={() => setActive(index)} disabled={isDisabled(dataType)}>
                                    {desc(dataType)}
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

        </ButtonGroup>
    )
}