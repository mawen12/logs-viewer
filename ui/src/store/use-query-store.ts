import type { TimeRange } from "@/components/time-range/time-range-picker";
import { TIMERANGE_OPTIONS, type TimeRangeValue } from "@/constant/time-range";
import type { TreeNode } from "@/features/home/components/source-group-tree";
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

type State = {
    query: string
    limit: number
    timeRange: TimeRange
    startTime: string
    endTime: string
    sources: Set<string>
}

type Actions = {
    setQuery: (query: string) => void
    setLimit: (limit: number) => void
    setTimeRange: (timeRange: TimeRange) => void
    setStartTime: (startTime: string) => void
    setEndTime: (endTime: string) => void
    addSource: (source: string) => void
    removeSource: (source: string) => void
    updateSource: (node: TreeNode, parentNode?: TreeNode) => void
    hasSource: (source: string) => boolean
}

export const useQueryStore = create<State & Actions>((set, get) => ({
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
    addSource: (source: string) =>
        set((state) => {
            const next = new Set(state.sources)
            next.add(source)
            return { sources: next }
        }),
    removeSource: (source: string) =>
        set((state) => {
            const next = new Set(state.sources)
            next.delete(source)
            return { sources: next }
        }),
    updateSource: (node: TreeNode, parentNode?: TreeNode) => 
        set(() => {
            const next = new Set(get().sources)

           if (next.has(node.id)) {
                next.delete(node.id)
                if (node.type == "group") {
                    node.children.forEach((c) => next.delete(c.id))
                } else {
                    next.delete(node.parentId)
                }
            } else {
                next.add(node.id)
                if (node.type === "group") {
                    node.children.forEach((c) => next.add(c.id))
                } else {
                    if (parentNode?.type === "group" && parentNode.children.every((c) => next.has(c.id))) {
                        next.add(node.parentId)
                    }
                }
            }
            return  {sources: next}
        }),
    hasSource: (source: string) => get().sources.has(source),
}))