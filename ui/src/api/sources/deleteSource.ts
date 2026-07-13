import { useMutation, useQueryClient, type QueryOptions } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";
import { apiKeys } from "../apiKeys";

type SourceDeleteRequest = {
    id: string
}

export const deleteSource = async (variables: SourceDeleteRequest): Promise<void> => {
    await axiosInstance.delete<void>(
        `sources/${variables.id}`,
        {
            timeout: 10000,
            withCredentials: true
        }
    )
}


export const useDeleteSource = (options?: QueryOptions) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...options,
        mutationKey: apiKeys.delete(),
        mutationFn: deleteSource,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeys.items() })
        }
    })
}
