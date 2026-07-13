import { useMutation, useQueryClient, type QueryOptions } from "@tanstack/react-query";
import type { Source } from "@/features/sources/data/schema";
import { apiKeys } from "@/api/apiKeys";
import { axiosInstance } from "@/api/axiosInstance";

export type SourceAddRequest = Omit<Source, 'id' | 'isConfiged'>

export const addSource = async (variables: SourceAddRequest): Promise<void> => {
    await axiosInstance.post<void>(
        "sources",
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


export const useAddSource = (options?: QueryOptions) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...options,
        mutationKey: apiKeys.add(),
        mutationFn: addSource,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeys.items() })
        }
    })
}
