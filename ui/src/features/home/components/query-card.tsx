import type { FetchLogsParams } from "@/api/type";
import type { WebsocketEvent } from "@/contexts/websocket-provider";
import { useWebsocketStore, type WebsocketQueryEvent } from "@/hooks/useWebsocketStore";
import { useAppStore } from "@/store/useAppStore";
import { useDebugStore } from "@/store/useDebugStore";
import { useLogStore } from "@/store/useLogStore";
import { useQueryStore } from "@/store/useQueryStore";
import { useTimeStore } from "@/store/useTimeStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { strToDateTimeMinuteDash } from "@/lib/time";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { ExecuteButton } from "@/components/business/ExecuteButton";

export function QueryCard() {
    const { type, range, timeParams } = useTimeStore();
    const { query, setQuery, limit, setLimit } = useQueryStore();

    const { serverUrl } = useAppStore();
    const { fetchLogs } = useLogStore();
    const { loading, durationMs, messageComposes, stats } = useLogStore();

    const fetchedCount = useMemo(() => {
        return messageComposes.reduce((sum, mc) => sum + (mc.logs?.length || 0), 0)
    }, [messageComposes])

    const matchedCount = useMemo(() => {
        return stats.reduce((sum, s) => sum + s.count, 0)
    }, [stats])

    const getParams = (refresh: boolean = false): FetchLogsParams => {
        let from = "", to = "";
        if (type === "quick") {
            const { from: quickFrom, to: quickTo } = strToDateTimeMinuteDash(range)
            from = quickFrom;
            to = quickTo;
        } else {
            from = timeParams.from || "";
            to = timeParams.to || "";
        }

        return {
            query: query,
            limit: limit,
            from: from,
            to: to,
            refresh: refresh,
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleQuery()
        }
    }

    const { setDebug } = useAppStore();
    const { uid, register, unregister } = useWebsocketStore();
    const { append, clearAll } = useDebugStore();

    const [debugChecked, setDebugChecked] = useState<boolean>(false);

    const handleQuery = (refresh: boolean = false) => {
        if (debugChecked) {
            setDebug(true);
            clearAll();
            fetchLogs(serverUrl, uid, getParams(refresh))
        } else {
            fetchLogs(serverUrl, "", getParams(refresh))
        }
    }

    const handler = useCallback((event: WebsocketEvent) => {
        const queryEvent = event as WebsocketQueryEvent;
        append(queryEvent.stream, queryEvent.content);
    }, [append]);

    useEffect(() => {
        if (!debugChecked) return;
        register("query", handler)

        return () => {
            unregister("query", handler)
            clearAll();
        }
    }, [debugChecked, register, handler, unregister, clearAll]);

    return (
        <Card className="flex-none">
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex gap-2">
                            <Label htmlFor="query" className="text-xl">
                                Query:
                            </Label>
                            <Input id="query" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                        </div>

                        <div className="flex gap-2">
                            <Label htmlFor="limit" className="text-xl">
                                Limit:
                            </Label>
                            <Input id="limit" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} onKeyDown={handleKeyDown} />
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Badge variant={"outline"} className="text-gray-500" >Query: {durationMs}ms</Badge>
                        <Badge variant={"outline"} className="text-gray-500">Fetched Count: {fetchedCount}</Badge>
                        <Badge variant={"outline"} className="text-gray-500">Matched Count: {matchedCount}</Badge>

                        <div className="ml-auto flex flex-row gap-2">
                            <Field orientation="horizontal">
                                <Checkbox id="debug" checked={debugChecked} onCheckedChange={(e) => setDebugChecked(e as boolean)} />
                                <Label htmlFor="debug">Debug</Label>
                            </Field>

                            <ExecuteButton loading={loading} handleQuery={handleQuery} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}