import type React from "react";
import { createContext, useContext, useState } from "react";

type QueryStateProviderProps = {
    children: React.ReactNode
}

type QueryStateProviderState = {
    query: string
    setQuery: (query: string) => void
    limit: number,
    setLimit: (limit: number) => void
}

const initialState: QueryStateProviderState = {
    query: "",
    setQuery: () => null,
    limit: 100,
    setLimit: () => null
}

const QueryStateProviderContext = createContext<QueryStateProviderState>(initialState)

export function QueryStateProvider({ children }: QueryStateProviderProps) {

    const [query, setQuery] = useState("")
    const [limit, setLimit] = useState(100)

    const value = {
        query, setQuery, 
        limit, setLimit
    }

    return (
        <QueryStateProviderContext.Provider value={value}>
            {children}
        </QueryStateProviderContext.Provider>
    )
}

export function useQueryState() {
    const context = useContext(QueryStateProviderContext)

    if (context == undefined) {
        throw new Error("useQueryState must be used within a QueryStateProvider")
    }

    return context
}


