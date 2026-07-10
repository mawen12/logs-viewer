import type { Mode, TimeRangeValue } from "@/constant/time-range";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type LogsProviderProps = {
    children: ReactNode
}

type LogsProviderState = {
    query: string
    setQuery: (query: string) => void
    limit: number,
    setLimit: (limit: number) => void
    timeRange: TimeRange
    setTimeRange: (timeRange: TimeRange) => void
}

const initTimeRage = {
    mode: "last", start: "5m"
} as TimeRange

const initLogsState = {
    query: '',
    setQuery: (query: string) => {},
    limit: 100,
    setLimit: (limit: number) => {},
    timeRange: initTimeRage,
    setTimeRange: (timeRange: TimeRange) => {}
}

const LogsContext = createContext<LogsProviderState>(initLogsState)

export type TimeRange = {
    mode: Mode
    start: TimeRangeValue | string
    end?: string
}

export function LogsProvider({children}: LogsProviderProps) {
    const [query, setQuery] = useState<string>('')
    const [limit, setLimit] = useState<number>(100)
    const [timeRange, setTimeRange] = useState<TimeRange>(initTimeRage)
    
    const contextValue = useMemo(() => ({
        query,
        setQuery,
        limit,
        setLimit,
        timeRange,
        setTimeRange,
    }), [query, setQuery, limit, setLimit, timeRange, setTimeRange])

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