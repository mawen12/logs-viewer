import type { FetchLogsParams } from "@/api/type";
import { useAppState } from "@/contexts/AppStateProvider";
import { useLogsState } from "@/contexts/LogsStateProvider";
import { useCallback, useState } from "react";


export const useFetchLogs = () => {
    const { serverUrl } = useAppState();

    const {setLogs, setLoading, setDurationMs, setMessageComposes} = useLogsState()
    const [error, setError] = useState<string>();

    const fetchLogs = useCallback(async (params: FetchLogsParams) => {
        try {
            setLoading(true);
            const url = getLogsUrl(serverUrl, params);
            const response = await fetch(url);

            const data = await response.json();
            if (!response.ok || !response.body) {
                setError(data);
                setLogs([]);
                return false;
            }
            setMessageComposes(data)
            const duration = response.headers.get("Logs-Viewer-Cost-Ms");
            setDurationMs(duration ? Number(duration) : undefined);
        } catch (e) {
            console.error(e);
            setError(String(e));
            setMessageComposes([]);
            return false;
        } finally {
            setLoading(false);
        }
    }, [serverUrl])

    return {
        error,
        fetchLogs,
    }
}

const getLogsUrl = (server: string, params: FetchLogsParams) => {
    const query = params.query || "";
    const limit = params.limit.toString() || "1";
    const from = params.from || "";
    const to = params.to || "";

    const ps = new URLSearchParams({ query, limit, from, to })
    return `${server}/query?${ps.toString()}`
}