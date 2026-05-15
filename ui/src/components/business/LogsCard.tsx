import { useAppStore } from "@/store/useAppStore";
import { IconLineDashed, IconTallymark1 } from '@tabler/icons-react';
import { Card, CardContent, CardHeader } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ComposeLogs } from "./ComposeLogs";
import { LogsTabs } from "./LogsTabs";

export function LogsCard() {
    const {direction, setDirection} = useAppStore();

    return (
        <Card className="h-full min-h-0">
            <CardHeader>
                <div className="flex flex-row ml-auto gap-2">
                    <ToggleGroup type="single" orientation="horizontal" variant="outline" value={direction} onValueChange={setDirection}>
                        <ToggleGroupItem value="tabs">
                            <IconLineDashed/>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="line">
                            <IconTallymark1/>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </CardHeader>
            <CardContent className="h-full min-h-0">
                {direction === "tabs" ? (
                    <LogsTabs/>
                ) : (
                    <ComposeLogs/>
                )}

            </CardContent>
        </Card>
    )
}