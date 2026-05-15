import type { Log } from "@/api/type";
import { SimpleLog } from "./SimpleLog";

type CardLogsProps = {
    logs: Log[]
}

export function CardLogs({ logs }: CardLogsProps) {
    return (
        <>
            {logs && logs.map((log, index) => (
                <div key={index} className="px-2">
                    <SimpleLog {...log} />
                </div>
            ))}
        </>
    )
}