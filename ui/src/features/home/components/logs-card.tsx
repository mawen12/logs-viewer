import { ColorfulButton } from "@/components/business/ColorfulButton";
import { ComposeLogs } from "@/components/business/ComposeLogs";
import { CopyButton } from "@/components/business/CopyButton";
import { DebugDrawer } from "@/components/business/DebugDrawer";
import { DirectionButton } from "@/components/business/DirectionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

export function LogsCard() {
    const [show, setShow] = useState<boolean>(true);

    const toggleShow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShow(s => !s);
    }

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Logs</CardTitle>
                </div>
                <DebugDrawer />
                <ColorfulButton />
                <CopyButton />
                <DirectionButton />
                <Button variant="outline" size="icon-sm" onClick={toggleShow} >
                    {show ? <IconEye /> : <IconEyeOff />}
                </Button>
            </CardHeader>
            {show && <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ComposeLogs />
            </CardContent>}
        </Card>
    )
}