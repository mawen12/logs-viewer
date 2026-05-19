import { create } from "zustand";

type DebugStore = {
    debugs: Record<string, string[]>,
    append: (stream: string, content: string) => void,
    clearAll: () => void
}

export const useDebugStore = create<DebugStore>((set) => ({
    debugs: {},
    append: (stream: string, content: string) =>
        set((state) => ({
            debugs: {
                ...state.debugs,
                [stream]: state.debugs[stream] ? [...state.debugs[stream], content] : [content]
            }
        })),
    clearAll: () => set({ debugs: {} }),
}))