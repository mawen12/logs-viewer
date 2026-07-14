import { useMutation, useQuery, type QueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosInstance";
import { apiKeys } from "@/api/apiKeys";
import type { TreeNode } from "@/features/home/components/source-group-tree";

export const getTreeSources = async (): Promise<TreeNode[]> => {
    const { data } = await axiosInstance.get<TreeNode[]>(
        `sources/tree`,
        {
            timeout: 10000,
            withCredentials: true
        }
    )

    return data
}

export const useGetTreeSources = (options?: QueryOptions) =>
    useMutation({
        ...options,
        mutationKey: apiKeys.tree(),
        mutationFn: getTreeSources,
    })

export const useGetTreeSourcesQuery = (options?: QueryOptions<TreeNode[]>): UseQueryResult<TreeNode[], Error> =>
    useQuery({
        ...options,
        queryKey: apiKeys.tree(),
        queryFn: () => getTreeSources()
    })
