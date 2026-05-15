import type { Log } from "@/api/type";
import { useLogStore } from "@/store/useLogStore";
import { useMemo } from "react";
import { CardLogs } from "./CardLogs";

export function ComposeLogs() {
    const { messageComposes } = useLogStore();

    const composedLogs = useMemo<Log[]>(() => {
        const allLogs = messageComposes.flatMap(mc => mc.logs || []);

        allLogs.sort((a, b) => {
            if (a.time != b.time) {
                return a.time - b.time;
            } else {
                return a.num - b.num;
            }
        })

        allLogs.every(log => {
            log.id = `${log.time}-${log.num}-${log.stream}`;
            return true;
        })        

        return allLogs;
    }, [messageComposes]);

    return (
        <CardLogs logs={composedLogs}/>   
    )
}