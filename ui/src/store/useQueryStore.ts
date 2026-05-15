import { create } from "zustand";

type QueryStore = {
    query: string,
    setQuery: (query: string) => void,
    limit: number,
    setLimit: (limit: number) => void,
}

export const useQueryStore = create<QueryStore>((set) => ({
    query: "",
    setQuery: (query: string) => set({ query }),
    limit: 100,
    setLimit: (limit: number) => set({ limit }),
}))