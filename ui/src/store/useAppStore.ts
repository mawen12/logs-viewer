import { getDefaultServer } from "@/utils/default-server-url";
import { create } from "zustand";

type AppStore = {
    serverUrl: string,
    setServerUrl: (serverUrl: string) => void,
}

export const useAppStore = create<AppStore>((set) => ({
    serverUrl: getDefaultServer(),
    setServerUrl: (serverUrl: string) => set({serverUrl})
}))