import type { DataTableEntity } from "@/types/data-table";
import type { Table } from "@tanstack/react-table";
import { createContext, useContext } from "react";

export type DataTableProviderState<TData> = {
    entity: DataTableEntity<TData>,
    table: Table<TData>
    loading: boolean
    refetchHandler: () => void
}

export const DataTableContext = createContext<DataTableProviderState<unknown> | undefined>(undefined)

export const useDataTable = <TData>() => {
    const context = useContext(DataTableContext) as DataTableProviderState<TData> | undefined

    if (!context) throw new Error('useDataTable must be used within a DataTableProvider')

    return context
}