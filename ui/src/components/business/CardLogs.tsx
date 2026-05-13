import type { Log } from "@/api/type";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {CardLog} from "./CardLog";

type CardLogsProps = {
    logs: Log[]
}

export function CardLogs({ logs }: CardLogsProps) {
    // const { logs } = useLogsState();

    return (
        <ScrollArea className="h-full flex flex-col gap-1 border rounded-md p-1">
            {logs && logs.map((log) => (
                <>
                    <CardLog key={log.num} {...log} />
                    <Separator />
                </>
            ))}
        </ScrollArea>
    )
}