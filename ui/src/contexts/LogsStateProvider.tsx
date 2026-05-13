import type { Log, MessageCompose, Stat } from "@/api/type";
import type React from "react";
import { createContext, useContext, useState } from "react";

type LogsStateProviderProps = {
    children: React.ReactNode
}

type LogsStateProviderState = {
    logs: Log[],
    setLogs: (logs: Log[]) => void,
    stats: Stat[],
    setStats: (stats: Stat[]) => void,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    durationMs?: number,
    setDurationMs: (duration: number | undefined) => void,
    messageComposes: MessageCompose[],
    setMessageComposes: (messageComposes: MessageCompose[]) => void,
}

const initialState: LogsStateProviderState = {
    logs: [],
    setLogs: () => null,
    stats: [],
    setStats: () => null,
    loading: false,
    setLoading: () => null,
    durationMs: undefined,
    setDurationMs: () => null,
    messageComposes: [],
    setMessageComposes: () => null,
}

const LogsStateProviderContext = createContext<LogsStateProviderState>(initialState)

export function LogsStateProvider({children}: LogsStateProviderProps) {
    
    const [logs, setLogs] = useState<Log[]>([])
    const [stats, setStats] = useState<Stat[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [durationMs, setDurationMs] = useState<number | undefined>();
    const [messageComposes, setMessageComposes] = useState<MessageCompose[]>([])


    const value = {
        logs, setLogs,
        stats, setStats,
        loading, setLoading,
        durationMs, setDurationMs,
        messageComposes, setMessageComposes,
    }   

    return (
        <LogsStateProviderContext.Provider value={value}>
            {children}
        </LogsStateProviderContext.Provider>
    )
}

export function useLogsState() {
    const context = useContext(LogsStateProviderContext)

    if (context == undefined) {
        throw new Error("useLogsState must be used within a LogsStateProvider")
    }

    return context
}

