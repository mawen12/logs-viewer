import type { FetchLogsParams } from "@/api/type";
import { useLogsState } from "@/contexts/LogsStateProvider";
import { useQueryState } from "@/contexts/QueryStateProvider";
import { useTimeState } from "@/contexts/TimeStateProvider";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import { strToTime } from "@/utils/TimeUtils";
import { useFetchLogs } from "@/hooks/useFetchLogs";
import { Badge } from "../ui/badge";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { useMemo } from "react";

export function QueryCard() {
    const { type, range, timeParams } = useTimeState();
    const { query, setQuery, limit, setLimit } = useQueryState()

    const { fetchLogs, } = useFetchLogs();
    const { loading, durationMs, messageComposes } = useLogsState()

    const total = useMemo(() => {
        return messageComposes.reduce((sum, mc) => sum + (mc.logs?.length || 0), 0)
    }, [messageComposes])

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
        fetchLogs(getParams())
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
                        <Badge variant={"outline"} className="text-gray-500">Count: {total}</Badge>

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