import type { Source } from "@/features/sources/data/schema";
import { useMutation, useQueryClient, type QueryOptions } from "@tanstack/react-query";
import { apiKeys } from "../apiKeys";
import { axiosInstance } from "../axiosInstance";

export type SourceUpdateRequest = Omit<Source, 'isConfiged'>

export const updateSource = async (variables: SourceUpdateRequest): Promise<void> => {
    await axiosInstance.put<void>(
        `sources/${variables.id}`,
        variables,
        {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000,
            withCredentials: true
        }
    )
}

export const useUpdateSource = (options?: QueryOptions) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...options,
        mutationKey: apiKeys.items(),
        mutationFn: updateSource,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeys.items() })
        }
    })
}
