import { IconLineDashed, IconTallymark1 } from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useAppStore } from "@/store/useAppStore";

export function DirectionButton () {
    const { direction, setDirection } = useAppStore();
    
    return (
        <ToggleGroup type="single" orientation="horizontal" variant="outline" size="sm" value={direction} onValueChange={setDirection}>
            <ToggleGroupItem value="tabs">
                <IconLineDashed />
            </ToggleGroupItem>
            <ToggleGroupItem value="line">
                <IconTallymark1 />
            </ToggleGroupItem>
        </ToggleGroup>
    )
    
}