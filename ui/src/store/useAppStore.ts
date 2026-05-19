import { create } from "zustand";

type AppStore = {
    serverUrl: string,
    setServerUrl: (serverUrl: string) => void,
    direction: "line" | "tabs",
    setDirection: (direction: "line" | "tabs") => void,
    colorful: boolean,
    setColorful: (colorful: boolean) => void,
    debug: boolean,
    setDebug: (debug: boolean) => void,
}

export const useAppStore = create<AppStore>((set) => ({
    serverUrl: document.location.origin,
    setServerUrl: (serverUrl: string) => set({serverUrl}),
    direction: "tabs",
    setDirection: (direction: "line" | "tabs") => set((state) => ({ ...state, direction })),
    colorful: false,
    setColorful: (colorful: boolean) => set((state) => ({ ...state, colorful })),
    debug: false,
    setDebug: (debug: boolean) => set((state) => ({ ...state, debug }))
}))