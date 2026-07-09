import { useWebsocket } from "@/contexts/websocket-provider";
import { useWebsocketStore } from "@/hooks/useWebsocketStore";
import { IconPlug, IconPlugX } from '@tabler/icons-react';
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


export function WebsocketButton() {
    const { status, err } = useWebsocket();
    const { uid } = useWebsocketStore();

    const iconColor = useMemo(() => {
        switch (status) {
            case "connecting":
                return "text-yellow-500"
            case "open":
                return "text-green-500"
            case "closing":
                return "text-orange-500"
            case "closed":
                return "text-red-500"
        }
    }, [status])

    const isOpen = useMemo(() => {
        return status === "open"
    }, [status])

    return (
        <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
                {isOpen ? <IconPlug className={`${iconColor} size-4 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg`} /> : <IconPlugX className={`${iconColor} size-4 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg`} />}
            </TooltipTrigger>
            <TooltipContent>
                <div className="flex flex-col gap-1">
                    <div className="px-2 py-1">
                        Websocket: {status}
                    </div>
                    {uid && (
                        <div className="p-2">
                            Uid: {uid}
                        </div>)
                    }

                    {err && (
                        <div className="p-2 text-red-500">
                            {JSON.stringify(err)}
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}