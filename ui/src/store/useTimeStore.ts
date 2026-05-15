import { create } from "zustand";

export type TimeParams = {
    from: string,
    to: string,
}

type TimeStore = {
    // 时间类型
    type: "quick" | "absolute" | "input"
    setType: (type: TimeStore["type"]) => void
    // type = quick 时值
    range: string
    setRange: (range: string) => void
    // type = absolute 时值
    timeParams: TimeParams
    setTimeParams: (timeParams: TimeParams) => void
    description: string
    setDescription: (description: string) => void
}

export const useTimeStore = create<TimeStore>((set) => ({
    type: "quick",
    setType: (type: TimeStore["type"]) => set({ type }),
    range: "15m",
    setRange: (range: string) => set({ range }),
    timeParams: {
        from: "",
        to: "",
    },
    setTimeParams: (timeParams: TimeParams) => set({ timeParams }),
    description: "last 15 minutes",
    setDescription: (description: string) => set({ description }),
}))