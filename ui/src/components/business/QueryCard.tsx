import type { FetchLogsParams } from "@/api/type";
import { useAppStore } from "@/store/useAppStore";
import { useLogStore } from "@/store/useLogStore";
import { useQueryStore } from "@/store/useQueryStore";
import { useTimeStore } from "@/store/useTimeStore";
import { strToTime } from "@/utils/TimeUtils";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

export function QueryCard() {
    const { type, range, timeParams } = useTimeStore();
    const {query, setQuery, limit, setLimit} = useQueryStore();

    const {serverUrl} = useAppStore();
    const { fetchLogs } = useLogStore();
    const { loading, durationMs, messageComposes, stats } = useLogStore();

    const fetchedCount = useMemo(() => {
        return messageComposes.reduce((sum, mc) => sum + (mc.logs?.length || 0), 0)
    }, [messageComposes])

    const matchedCount = useMemo(() => {
        return stats.reduce((sum, s) => sum + s.count, 0)
    }, [stats])

    const getParams = (): FetchLogsParams => {
        let fromStr = "", toStr = "";
        if (type === "quick") {
            const { from: quickFrom, to: quickTo } = strToTime(range)
            fromStr = quickFrom;
            toStr = quickTo;
        } else {
            fromStr = timeParams.from || "";
            toStr = timeParams.to || "";
        }

        return {
            query: query,
            limit: limit,
            from: fromStr,
            to: toStr,
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleQuery()
        }
    }

    const handleQuery = () => {
        fetchLogs(serverUrl, getParams())
    }

    return (
        <Card className="flex-none">
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <div className="relative w-full">
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                            <Label className="absolute top-[-10px] left-[6px] px-1 text-muted-foreground dark:bg-tranparent text-xs pointer-events-none" style={{
                                backgroundColor: 'var(--bg)',
                            }}>
                                Query
                            </Label>
                        </div>

                        <div className="relative w-48">
                            <Input value={limit} onChange={(e) => setLimit(Number(e.target.value))} onKeyDown={handleKeyDown} />
                            <Label className="absolute top-[-10px] left-[6px] px-1 text-muted-foreground text-xs pointer-events-none" style={{
                                backgroundColor: 'var(--bg)',
                            }}>
                                Limit
                            </Label>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        {durationMs && <Badge variant={"outline"} className="text-gray-500" >Query: {durationMs}ms</Badge>}
                        <Badge variant={"outline"} className="text-gray-500">Fetched Count: {fetchedCount}</Badge>
                        <Badge variant={"outline"} className="text-gray-500">Matched Count: {matchedCount}</Badge>

                        <div className="ml-auto">
                            <Button variant="outline" onClick={handleQuery} disabled={loading}>
                                {loading ? <Spinner /> : <IconCaretRightFilled />}
                                Execute
                            </Button>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}