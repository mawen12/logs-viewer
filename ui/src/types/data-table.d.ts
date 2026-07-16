import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";

export interface DataTableEntity<TData> {
    id: string
    itemValue: string
    showToolbar: boolean
    headers: DataTableEntityHeader[]
    rowAction?: DataTableEntityRowAction<TData>
    massActions?: DataTableEntityAction[]
    globalActions?: DataTableEntityAction[]
    getAnchor?: (item) => void
    filterData?: (data, filter) => void
}

export interface DataTableEntityHeader {
    key: string
    title?: string
    sortable?: boolean
    filterable?: boolean
    align?: 'start' | 'center' | 'end'
    className?: string
    thClassName?: string
    tdClassName?: string
}

export interface DataTableEntityAction {
    id: string
    label: string
    icon: ReactNode
}

export interface DataTableEntityRowAction<TData> {
    type: string
    component: (row: Row<TData>) => ReactNode
}