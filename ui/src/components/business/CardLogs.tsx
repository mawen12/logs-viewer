import type { Log } from "@/api/type";
import { SimpleLog } from "./SimpleLog";

type CardLogsProps = {
    logs: Log[]
}

export function CardLogs({ logs }: CardLogsProps) {
    return (
        <>
            {logs && logs.map((log) => (
                <div key={log.id} className="px-2">
                    <SimpleLog key={log.id} {...log} />
                </div>
            ))}
        </>
    )
}