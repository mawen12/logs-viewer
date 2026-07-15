import { useGetLogs } from "@/api/log/getLogs";
import type { MessageCompose, Stat } from "@/api/type";
import { type Mode, type TimeRangeValue } from "@/constant/time-range";
import { useQueryStore } from "@/store/use-query-store";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type LogsProviderProps = {
    children: ReactNode
}

type LogsProviderState = {
    logs: MessageCompose[]
    stats: Stat[]
    isFetching: boolean
    refetch: () => Promise<void>
}

const LogsContext = createContext<LogsProviderState | undefined>(undefined)

export type TimeRange = {
    mode: Mode
    start: TimeRangeValue | string
    end?: string
}

export function LogsProvider({ children }: LogsProviderProps) {
    const { query, limit, timeRange, startTime, endTime, sources } = useQueryStore()

    const [logs, setLogs] = useState<MessageCompose[]>([])
    const [stats, setStats] = useState<Stat[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const logsState = useGetLogs({})

    const handleQuery = useCallback(async () => {
        setIsFetching(true)
        const { messageComposes, stats } = await logsState.mutateAsync({
            query,
            limit,
            from: startTime,
            to: endTime,
            sources: sources
        })

        setIsFetching(false)
        setLogs(messageComposes ?? [])
        setStats(stats ?? [])

    }, [setLogs, setStats, query, limit, timeRange, sources])

    const contextValue = useMemo(() => ({
        logs,
        stats,
        isFetching,
        refetch: handleQuery
    }), [logs, stats, isFetching, handleQuery])

    return (
        <LogsContext value={contextValue}>
            {children}
        </LogsContext>
    )
}

export const useLogs = () => {
    const context = useContext(LogsContext)

    if (!context) throw new Error('useLogs must be used within a LogsProvider')

    return context
}