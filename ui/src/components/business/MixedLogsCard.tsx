import type { MessageCompose } from "@/api/type";
import { useAppStore } from "@/store/useAppStore";
import { useLogStore } from "@/store/useLogStore";
import { useEffect, useMemo, useState } from "react";
import { CardLogs } from "./CardLogs";
import { ColorfulButton } from "./ColorfulButton";
import { ComposeLogs } from "./ComposeLogs";
import { CopyButton } from "./CopyButton";
import { DataButtonGroup } from "./DataButtonGroup";
import { DirectionButton } from "./DirectionButton";
import { DebugDrawer } from "./DebugDrawer";

export function MixedLogsCard() {
    const { direction } = useAppStore();

    const { messageComposes } = useLogStore();

    const defaultIndex = useMemo<number>(() => {
        if (messageComposes.length == 0) {
            return -1;
        }

        for (let i = 0; i < messageComposes.length; i++) {
            if (messageComposes[i].logs && messageComposes[i].logs.length > 0) {
                return i;
            }
        }
        return 0;
    }, [messageComposes]);

    const [activeTab, setActiveTab] = useState<number>(defaultIndex);

    useEffect(() => {
        setActiveTab(defaultIndex);
    }, [defaultIndex])

    const descFunc = (messageCompose: MessageCompose):string => {
        return `${messageCompose?.stream}<${messageCompose?.logs?.length || 0}>`
    }

    const isDisabled = (messageCompose: MessageCompose):boolean => {
        return !messageCompose?.logs || messageCompose?.logs?.length === 0
    }

    return (
        <div className="group/card flex flex-col rounded-xl bg-card py-2 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl">
            <div className="sticky top-0 z-[3] bg-card group/card-header @container/card-header  items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3">
                <div className="flex flex-row ml-auto gap-2 items-center h-[41.5px]">
                    <div>
                        {direction === "tabs" && activeTab >= 0 && (
                            <DataButtonGroup data={messageComposes} active={activeTab} setActive={setActiveTab} desc={descFunc} isDisabled={isDisabled} />
                        )}
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <DebugDrawer/>
                        <ColorfulButton />
                        <CopyButton />
                        <DirectionButton />
                    </div>
                </div>
            </div>

            <div className="px-4 group-data-[size=sm]/card:px-3">
                {direction === "tabs" && activeTab >= 0 ? (
                    <CardLogs logs={messageComposes[activeTab]?.logs} />
                ) : (
                    <ComposeLogs />
                )}
            </div>
        </div>
    )
}