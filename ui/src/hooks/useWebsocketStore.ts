import type { WebsocketEvent } from "@/contexts/WebsocketProvider";
import { create } from "zustand";

export interface WebsocketInitEvent extends WebsocketEvent {
    uid: string
}

export interface WebsocketQueryEvent extends WebsocketEvent {
    stream: string
    content: string
}

type EventHandler = (event: WebsocketEvent) => void

type WebsocketStore = {
    uid: string,
    setUid: (uid: string) => void,
    handlers: Record<string, EventHandler[]>,
    register: (event: string, handler: EventHandler) => void;
    unregister: (event: string, handler: EventHandler) => void;
    notify: (event: WebsocketEvent) => void,
    clearAll: () => void;
}

export const useWebsocketStore = create<WebsocketStore>((set, get) => ({
    uid: "",
    setUid: (uid: string) =>
        set((state) => ({ ...state, uid: uid })),
    handlers: {},
    register: (event: string, handler: EventHandler) =>
        set((state) => ({
            ...state,
            handlers: {
                ...state.handlers,
                [event]: [...(state.handlers[event] ?? []), handler]
            }
        })),
    unregister: (event: string, handler: EventHandler) =>
        set((state) => ({
            ...state,
            handlers: {
                ...state.handlers,
                [event]: state.handlers[event]?.filter(v => v !== handler) ?? []
            }
        })),
    notify: (event: WebsocketEvent) => {
        switch (event.type) {
            case 'init': {
                const initEvent = event as WebsocketInitEvent;
                set({ uid: initEvent.uid });
                get().handlers["init"]?.forEach((handler) => handler(event))
                break;
            }
            case 'query': {
                get().handlers["query"]?.forEach((handler) => handler(event));
                break;
            }
            default:
                console.warn('Unknown websocket event type:', event.type);
        }
    },
    clearAll: () => set({ handlers: {}, uid: "" }),
}))