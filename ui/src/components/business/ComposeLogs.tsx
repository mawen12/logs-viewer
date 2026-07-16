import type { Log } from "@/api/type";
import { useLogs } from "@/features/home/components/logs-provider";
import { useMemo } from "react";
import { CardLogs } from "./CardLogs";

export function ComposeLogs() {
    const { logs } = useLogs();

    const composedLogs = useMemo<Log[]>(() => {
        const allLogs = logs.flatMap(mc => mc.logs || []);

        allLogs.sort((a, b) => {
            if (a.time != b.time) {
                return a.time - b.time;
            } else {
                return a.num - b.num;
            }
        });    

        return allLogs;
    }, [logs]);

    return (
        <CardLogs logs={composedLogs}/>   
    )
}