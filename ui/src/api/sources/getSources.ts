import { useMutation, useQuery, type QueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosInstance";
import { apiKeys } from "@/api/apiKeys";
import type { Source } from "@/features/sources/data/schema";

type SourcesRequest = {
    page?: number
    pageSize?: number
}

export const getSources = async (variables: SourcesRequest): Promise<Source[]> => {
    const { data } = await axiosInstance.get<Source[]>(
        `sources?page=${variables.page}&pageSize=${variables.pageSize}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000,
            withCredentials: true
        }
    )

    return data
}

export const useGetSources = (options?: QueryOptions) =>
    useMutation({
        ...options,
        mutationKey: apiKeys.items(),
        mutationFn: getSources,
    })

export const useGetSourcesQuery = (variables: SourcesRequest, options?: QueryOptions<Source[]>): UseQueryResult<Source[], Error> =>
    useQuery({
        ...options,
        queryKey: apiKeys.items(),
        queryFn: () => getSources(variables)
    })
