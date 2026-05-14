import { useAppState } from "@/contexts/AppStateProvider";
import { Card, CardContent, CardHeader } from "../ui/card";
import { LogsTabs } from "./LogsTabs";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { IconLineDashed } from '@tabler/icons-react';
import { IconTallymark1 } from '@tabler/icons-react';
import { ComposeLogs } from "./ComposeLogs";

export function LogsCard() {
    const {direction, setDirection} = useAppState();

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