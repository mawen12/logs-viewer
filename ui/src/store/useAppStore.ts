import { create } from "zustand";

type AppStore = {
    serverUrl: string,
    setServerUrl: (serverUrl: string) => void,
    direction: "line" | "tabs",
    setDirection: (direction: "line" | "tabs") => void,
    colorful: boolean,
    setColorful: (colorful: boolean) => void,
}

export const useAppStore = create<AppStore>((set) => ({
    serverUrl: document.location.host,
    setServerUrl: (serverUrl: string) => set({serverUrl}),
    direction: "tabs",
    setDirection: (direction: "line" | "tabs") => set({ direction }),
    colorful: false,
    setColorful: (colorful: boolean) => set({ colorful }),
}))