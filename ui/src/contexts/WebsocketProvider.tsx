import { useWebsocketStore } from "@/hooks/useWebsocketStore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type WebsocketProviderProps = {
    children: React.ReactNode
}

export interface WebsocketEvent {
    type: string
}

export interface WebsocketContextProps {
    ws: WebSocket | undefined,
    status: WsStatus,
    err: Event | null
}

const WebsocketContext = createContext<WebsocketContextProps>({ws: undefined, status: "closed", err: null});

type WsStatus = "connecting" | "open" | "closing" | "closed";

export function WebsocketProvider({ children }: WebsocketProviderProps) {
    const [ws, setWs] = useState<WebSocket | undefined>(undefined);
    const [status, setStatus] = useState<WsStatus>("open");
    const [err, setErr] = useState<Event | null>(null);
    const { notify } = useWebsocketStore()

    const connect = useCallback(() => {
        if (ws && ws.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
            return;
        }

        setStatus("connecting");
        setErr(null);

        const inst = new WebSocket(`ws://${document.location.host}/ws`);

        inst.onopen = () => setStatus("open");
        inst.onerror = (e) => {
            setErr(e);
        };
        inst.onclose = () => {
            setStatus("closed");
            setWs(undefined);
        }
        inst.onmessage = (event) => {
            const wsEvent: WebsocketEvent = JSON.parse(event.data)
            notify(wsEvent);
        }

        setWs(inst)
    }, [ws, notify])

    // const disconnect = useCallback(() => {
    //     if (!ws) return;
    //     setStatus("closing");
    //     ws.close(1000, "manual close");
    // }, [ws])

    useEffect(() => {
        connect();

        return () => {
            ws?.close(1000, "unmount")
        }
    }, [connect, ws]);

    const value = {
        ws,
        status,
        err
    }

    return <WebsocketContext.Provider value={value}>
        {children}
    </WebsocketContext.Provider>
}

export function useWebsocket() {
    const context = useContext(WebsocketContext)

    if (context === undefined) {
        throw new Error("useWebsocket must be used within a WebsocketProvider")
    }

    return context
}