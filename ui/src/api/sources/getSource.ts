import { useMutation, useQuery, type QueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosInstance";
import { apiKeys } from "@/api/apiKeys";
import type { Source } from "@/features/sources/data/schema";

type SourceRequest = {
    id: string
}

export const getSource = async (variables: SourceRequest): Promise<Source> => {
    const { data } = await axiosInstance.get<Source>(
        `sources/${variables.id}`,
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

export const useGetSource = (options?: QueryOptions) =>
    useMutation({
        ...options,
        mutationKey: apiKeys.items(),
        mutationFn: getSource,
    })

export const useGetSourceQuery = (variables: SourceRequest, options?: QueryOptions<Source>): UseQueryResult<Source, Error> =>
    useQuery({
        ...options,
        queryKey: apiKeys.detail(variables.id),
        queryFn: () => getSource(variables)
    })
