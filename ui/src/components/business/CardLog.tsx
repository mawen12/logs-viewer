import type { Log } from "@/api/type";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useMemo } from "react";

export function CardLog(log: Log) {

    const normalizedMessage = useMemo(() => {
        return log.message
                .replace(/\r\n/g, "\n")
                .replace(/\0/g, "\n");
    }, [log])

    return (
        <Card className="ring-0 py-1 gap-1">
            <CardHeader className="flex flex-row gap-1 px-2 justify-end">
                <Badge variant="outline" className="h-4 text-gray-400 text-[9px]">
                    line: {log.num}
                </Badge>
            </CardHeader>
            <CardContent className="px-2">
                <span className="text-[11px] font-monospace leading-snug whitespace-pre-wrap break-words">
                {normalizedMessage}
                </span>
            </CardContent>
        </Card>
    )
}