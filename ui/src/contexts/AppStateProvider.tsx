import { getDefaultServer } from "@/utils/default-server-url";
import React, { createContext, useContext, useState } from "react";

type AppStateProvidderProps = {
    children: React.ReactNode
}

type AppStateProviderState = {
    serverUrl: string,
}

const initialState:AppStateProviderState = {
    serverUrl: getDefaultServer(),
}

const AppStateProviderContext = createContext<AppStateProviderState>(initialState)

export function AppStateProdiver({children}: AppStateProvidderProps) {
    // @ts-expect-error TODO: fix this
    const [serverUrl, setServerUrl] = useState(getDefaultServer())

    const value = {
        serverUrl
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
