import type { TimeRange } from "@/components/time-range/time-range-picker";
import { TIMERANGE_OPTIONS, type TimeRangeValue } from "@/constant/time-range";
import { toDateTimeLocalValue } from "@/lib/time";
import { create } from "zustand";

const initialRange = buildRange(TIMERANGE_OPTIONS[0].value)

function buildRange(value: TimeRangeValue) {
    const now = new Date()
    const start = new Date(now.getTime() - toRangeMs(value))

    return {
        start: toDateTimeLocalValue(start),
        end: toDateTimeLocalValue(now),
    }
}

function toRangeMs(value: TimeRangeValue) {
    const amount = parseInt(value, 10)

    if (value.endsWith('m')) {
        return amount * 60 * 1000
    }

    if (value.endsWith('h')) {
        return amount * 60 * 60 * 1000
    }

    if (value.endsWith('d')) {
        return amount * 24 * 60 * 60 * 1000
    }

    return 0
}

const initTimeRage = {
    mode: "last", start: "5m"
} as TimeRange

type QueryStore = {
    query: string
    setQuery: (query: string) => void
    limit: number,
    setLimit: (limit: number) => void
    timeRange: TimeRange
    setTimeRange: (timeRange: TimeRange) => void
    startTime: string
    setStartTime: (startTime: string) => void
    endTime: string
    setEndTime: (endTime: string) => void
    sources: Set<string>
    setSources: (sources: Set<string>) => void
}

export const useQueryStore = create<QueryStore>((set) => ({
    query: "",
    setQuery: (query: string) => set({ query }),
    limit: 100,
    setLimit: (limit: number) => set({ limit }),
    timeRange: initTimeRage,
    setTimeRange: (timeRange: TimeRange) => set({ timeRange }),
    startTime: initialRange.start,
    setStartTime: (startTime: string) => set({ startTime }),
    endTime: initialRange.end,
    setEndTime: (endTime: string) => set({ endTime }),
    sources: new Set<string>(),
    setSources: (sources: Set<string>) => set({ sources: new Set(sources) }),
}))