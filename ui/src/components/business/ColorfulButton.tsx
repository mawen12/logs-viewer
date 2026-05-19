import { IconPalette, IconPaletteOff } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useAppStore } from "@/store/useAppStore";

export function ColorfulButton() {

    const { colorful, setColorful } = useAppStore();

    const toggleColorful = () => {
        setColorful(!colorful);
    }

    return (
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
    )
}