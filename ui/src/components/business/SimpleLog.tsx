import { useAppStore } from "@/store/useAppStore";
import { useMemo } from "react";

const levelColors = {
    ERROR: "text-[#dc2626]",
    WARN: "text-[#ca8a04]",
    // INFO: "text-green-500",
    // DEBUG: "text-blue-500",
}

export interface SimpleLogProps {
    message: string
    level?: string,
    className?: string,
}

export function SimpleLog({ level, message, className }: SimpleLogProps) {
    const normalizedMessage = useMemo(() => {
        return message
            .replace(/\r\n/g, "\n")
            .replace(/\0/g, "\n");
    }, [message])

    const {colorful} = useAppStore();

     const color = useMemo(() => {
        if (colorful && level && level in levelColors) {
            return levelColors[level as keyof typeof levelColors];
        }

        return "";
    }, [level, colorful])

    return (
        <span className={`block w-full text-[11px] font-mono leading-snug whitespace-pre-wrap [overflow-wrap:anywhere] ${color} ${className}`}>
            {normalizedMessage}
        </span>

    )
}