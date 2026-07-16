import { createContext, useContext } from "react";
import type { WebsocketProviderState } from "./websocket-provider";

export const WebsocketContext = createContext<WebsocketProviderState>({ ws: undefined, status: "closed", err: null });

export function useWebsocket() {
    const context = useContext(WebsocketContext)

    if (context === undefined) {
        throw new Error("useWebsocket must be used within a WebsocketProvider")
    }

    return context
}