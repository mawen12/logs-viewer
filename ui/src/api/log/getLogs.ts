import { useMutation, useQuery, type QueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosInstance";
import { apiKeys } from "@/api/apiKeys";
import type { MessageCompose, Stat } from "../type";

export interface LogRequest {
    query: string
    limit: number
    from: string
    to: string
    refresh: boolean
    sources: Set<string>
}

export interface LogResponse {
    messageComposes: MessageCompose[]
    stats: Stat[]
    durationMs: number
}

export const getLogs = async (variables: LogRequest): Promise<LogResponse> => {
    const query = variables.query || "";
    const limit = variables.limit.toString() || "1";
    const from = variables.from || "";
    const to = variables.to || "";
    const refresh = variables.refresh  ?  "true" : "false";
    const sources = Array.from(variables.sources).join(",");

    const ps = new URLSearchParams({ query, limit, from, to, refresh, sources})

    const { data } = await axiosInstance.get<LogResponse>(
        `query?${ps.toString()}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000,
            withCredentials: true
        }
    )

    data.stats.forEach(stat => {
        stat.time = stat.time * 1000
    });

    return data
}

export const useGetLogs = (options?: QueryOptions) =>
    useMutation({
        ...options,
        mutationKey: apiKeys.logs(),
        mutationFn: getLogs,
    })

export const useGetLogsQuery = (variables: LogRequest, options?: QueryOptions<LogResponse>): UseQueryResult<LogResponse, Error> =>
    useQuery({
        ...options,
        queryKey: apiKeys.logs(),
        queryFn: () => getLogs(variables)
    })
