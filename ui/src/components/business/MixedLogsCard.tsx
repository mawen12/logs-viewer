import type { MessageCompose } from "@/api/type";
import { useAppStore } from "@/store/useAppStore";
import { useLogStore } from "@/store/useLogStore";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CardLogs } from "./CardLogs";
import { ColorfulButton } from "./ColorfulButton";
import { ComposeLogs } from "./ComposeLogs";
import { CopyButton } from "./CopyButton";
import { DataButtonGroup } from "./DataButtonGroup";
import { DirectionButton } from "./DirectionButton";
import { DebugButton } from "./DebugButton";

export function MixedLogsCard() {
    const { direction } = useAppStore();

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

    const descFunc = (messageCompose: MessageCompose):string => {
        return `${messageCompose.stream}<${messageCompose.logs?.length || 0}>`
    }

    const isDisabled = (messageCompose: MessageCompose):boolean => {
        return !messageCompose.logs || messageCompose.logs?.length === 0
    }

    return (
        <Card className="flex-none border p-2 relative">

            <CardHeader className="sticky top-0 z-[3] ">
                <div className="flex h-[41.5px] items-center">
                    <div>
                        {direction === "tabs" && activeTab >= 0 && (
                            <DataButtonGroup data={messageComposes} active={activeTab} setActive={setActiveTab} desc={descFunc} isDisabled={isDisabled} />
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <DebugButton/>
                        <ColorfulButton/>
                        <CopyButton />
                        <DirectionButton/>
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