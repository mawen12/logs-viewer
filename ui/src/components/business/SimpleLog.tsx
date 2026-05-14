import type { Log } from "@/api/type";
import { useMemo } from "react";

export function SimpleLog({ message }: Log) {
    const normalizedMessage = useMemo(() => {
        return message
            .replace(/\r\n/g, "\n")
            .replace(/\0/g, "\n");
    }, [message])

    return (
        <span className="block w-full text-[11px] font-mono leading-snug whitespace-pre-wrap wrap-break-word">
            {normalizedMessage}
        </span>

    )
}