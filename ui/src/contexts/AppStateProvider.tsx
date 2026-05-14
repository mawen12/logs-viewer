import { getDefaultServer } from "@/utils/default-server-url";
import React, { createContext, useContext, useState } from "react";

type AppStateProvidderProps = {
    children: React.ReactNode
}

type AppStateProviderState = {
    serverUrl: string,
    direction: "line" | "tabs",
    setDirection: (direciton: "line" | "tabs") => void,
}

const initialState:AppStateProviderState = {
    serverUrl: getDefaultServer(),
    direction: "tabs",
    setDirection: () => {},
}

const AppStateProviderContext = createContext<AppStateProviderState>(initialState)

export function AppStateProvider({children}: AppStateProvidderProps) {
    // @ts-expect-error TODO: fix this
    const [serverUrl, setServerUrl] = useState(getDefaultServer())
    const [direction, setDirection] = useState<"line" | "tabs">("tabs")

    const value = {
        serverUrl,
        direction,
        setDirection,
    }

    return (
        <AppStateProviderContext.Provider value={value}>
            {children}
        </AppStateProviderContext.Provider>
    )
}

export function useAppState() {
    const context = useContext(AppStateProviderContext)

    if (context == undefined) {
        throw new Error("useQueryState must be used within a QueryStateProvider")
    }

    return context
}
