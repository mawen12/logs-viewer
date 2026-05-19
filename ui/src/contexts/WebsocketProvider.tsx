import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWebsocketStore } from "@/hooks/useWebsocketStore";
import { IconAlertCircle } from '@tabler/icons-react';
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type WebsocketProviderProps = {
    children: React.ReactNode
}

export interface WebsocketEvent {
    type: string
}

const WebsocketContext = createContext<WebSocket | undefined>(undefined);

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

    return <WebsocketContext.Provider value={ws}>
        {err && (
            <Alert variant="destructive" className="max-w-md">
                <IconAlertCircle />
                <AlertTitle>Websocket {status}</AlertTitle>
                <AlertDescription>
                    {JSON.stringify(err)}
                </AlertDescription>
            </Alert>
        )
        }
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