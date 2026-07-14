import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions, type DialogType } from "@/components/data-table/row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableEntity } from "@/types/data-table";
import { getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type PaginationState, type Row, type SortingState, type Table, type VisibilityState } from "@tanstack/react-table";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DataTableProviderProps<TData> = {
    children: ReactNode
    entity: DataTableEntity,
    data: TData[]
    loading: boolean
    refetchHandler: () => void
    actionsHandler: () => void
    massActionsHandler: () => void
    globalActionsHandler: () => void
    setOpen: (value: DialogType | null) => void
    setCurrentRow: (value: TData | null) => void
    getCurrentRow: (value: Row<TData>) => TData
}

type DataTableProviderState<TData> = {
    table: Table<TData>
    loading: boolean
    refetchHandler: () => void
}

const DataTableContext = createContext<DataTableProviderState<unknown> | undefined>(undefined)

export function DataTableProvider<TData>({
    children,
    entity,
    data,
    loading,
    refetchHandler,
    actionsHandler,
    massActionsHandler,
    globalActionsHandler,
    setOpen,
    setCurrentRow,
    getCurrentRow,
}: DataTableProviderProps<TData>
) {
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [columnFilters, setColumnsFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 })

    const columns = useMemo((): ColumnDef<TData>[] => {
        return entity.headers.map((header) => {
            if (header.key === "data-table-select") {
                return {
                    id: 'select',
                    header: ({ table }) => (
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && 'indeterminate')
                            }
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label='Select all'
                            className='translate-y-0.5'
                        />
                    ),
                    cell: ({ row }) => (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label='Select row'
                            className='translate-y-0.5'
                        />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                }
            } else if (header.key === 'data-table-actions') {
                return {
                    id: 'actions',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={header.title ?? header.key} />
                    ),
                    cell: ({ row }) => (
                        <DataTableRowActions
                            row={row}
                            setOpen={setOpen}
                            setCurrentRow={setCurrentRow}
                            getCurrentRow={getCurrentRow}
                        />
                    ),
                    enableHiding: false,
                    enableSorting: false,
                }
            }

            return {
                accessorKey: header.key,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={header.title ?? header.key} />
                ),
                meta: { className: header.className, thClassName: header.tdClassName, tdClassName: header.tdClassName },
                cell: ({ row }) => <div className='truncate font-medium'>{row.getValue(header.key)}</div>,
                enableSorting: header.sortable,
                enableHiding: false,
            }
        })
    }, [entity.headers, setOpen, getCurrentRow, setCurrentRow])

    const table = useReactTable({
        data: data ?? [],
        columns: columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            pagination
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: (row, _columnId, filterValue) => {
            const id = String(row.getValue('id')).toLowerCase()
            const title = String(row.getValue('title')).toLowerCase()
            const searchValue = String(filterValue).toLowerCase()

            return id.includes(searchValue) || title.includes(searchValue)
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnsFilters,
    })


    return (
        <DataTableContext.Provider
            value={{ table, loading, refetchHandler } as DataTableProviderState<unknown>}
        >
            {children}
        </DataTableContext.Provider>
    )
}

export const useDataTable = <TData,>() => {
    const context = useContext(DataTableContext) as DataTableProviderState<TData> | undefined

    if (!context) throw new Error('useDataTable must be used within a DataTableProvider')

    return context
}