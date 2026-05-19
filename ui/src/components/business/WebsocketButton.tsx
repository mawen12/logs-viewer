import { useWebsocket } from "@/contexts/WebsocketProvider";
import { Button } from "../ui/button";
import { IconPlug, IconPlugX } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useWebsocketStore } from "@/hooks/useWebsocketStore";
import { useMemo } from "react";


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
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm" className={`${iconColor}`}>
                    {isOpen ? <IconPlug /> : <IconPlugX />}
                </Button>
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