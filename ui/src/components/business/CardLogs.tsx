import type { Log } from "@/api/type";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SimpleLog } from "./SimpleLog";

type CardLogsProps = {
    logs: Log[]
}

export function CardLogs({ logs }: CardLogsProps) {
    return (
        <ScrollArea className="h-full min-h-0 flex flex-col gap-1 border rounded-md p-1">
            {logs && logs.map((log) => (
                <>
                    {/* <CardLog key={log.num} {...log} /> */}
                    <SimpleLog key={log.num} {...log}/>
                    <Separator />
                </>
            ))}
        </ScrollArea>
    )
}