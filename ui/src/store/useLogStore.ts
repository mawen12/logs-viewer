import type { FetchLogsParams, MessageCompose, Stat } from "@/api/type";
import { create } from "zustand";

type LogStore = {
    direction: "line" | "tabs",
    setDirection: (direction: "line" | "tabs") => void,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    err: string | undefined,
    setError: (err: string | undefined) => void,
    messageComposes: MessageCompose[],
    setMessageComposes: (messageComposes: MessageCompose[]) => void,
    stats: Stat[],
    setStats: (stats: Stat[]) => void,
    durationMs: number,
    setDurationMs: (duration: number) => void,
    fetchLogs: (serverUrl: string, params: FetchLogsParams) => Promise<void>,
}

export const useLogStore = create<LogStore>((set) => ({
    direction: "tabs",
    setDirection: (direction: "line" | "tabs") => set({ direction }),
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
    err: undefined,
    setError: (err: string | undefined) => set({ err }),
    messageComposes: [],
    setMessageComposes: (messageComposes: MessageCompose[]) => set({ messageComposes }),
    stats: [],
    setStats: (stats: Stat[]) => set({ stats }),
    durationMs: 0,
    setDurationMs: (duration: number) => set({ durationMs: duration }),
    fetchLogs: async (serverUrl: string, params: FetchLogsParams): Promise<void> => {
        try {
            set({ loading: true });
            const url = getLogsUrl(serverUrl, params);
            const response = await fetch(url);

            const data = await response.json();
            if (!response.ok || !response.body) {
                set({
                    err: String(data),
                    messageComposes: [],
                    stats: [],
                    durationMs: 0,
                })
                return;
            }

            set({
                messageComposes: data.messageComposes || [],
                stats: data.stats || [],
                err: undefined,
                durationMs: response.headers.get("Logs-Viewer-Cost-Ms") ? Number(response.headers.get("Logs-Viewer-Cost-Ms")) : 0,
            })
        } catch (e) {
            console.error(e);
            set({
                err: String(e),
                messageComposes: [],
                stats: [],
                durationMs: 0,
            })
        } finally {
            set({ loading: false });
        }
    },
}))

const getLogsUrl = (server: string, params: FetchLogsParams) => {
    const query = params.query || "";
    const limit = params.limit.toString() || "1";
    const from = params.from || "";
    const to = params.to || "";

    const ps = new URLSearchParams({ query, limit, from, to })
    return `${server}/query?${ps.toString()}`
}