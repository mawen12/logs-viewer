import type { ReactNode } from "react";

export interface DataTableEntity {
    id: string
    itemValue: string
    showToolbar: boolean
    headers: DataTableEntityHeader[]
    rowAction?: DataTableEntityRowAction
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

export interface DataTableEntityRowAction {
    type: string
    component: ReactNode
}