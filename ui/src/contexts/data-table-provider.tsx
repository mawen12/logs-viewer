import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions, type DialogType } from "@/components/data-table/row-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableEntity } from "@/types/data-table";
import { getCoreRowModel, getExpandedRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type PaginationState, type SortingState, type VisibilityState } from "@tanstack/react-table";
import { ChevronRight, ChevronsRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { DataTableContext, type DataTableProviderState } from "./use-datatable";

export type DataTableProviderProps<TData> = {
    children: ReactNode
    entity: DataTableEntity<TData>,
    data: TData[]
    loading: boolean
    refetchHandler: () => void
    actionsHandler: () => void
    massActionsHandler: () => void
    globalActionsHandler: () => void
    setOpen: (value: DialogType | null) => void
    setCurrentRow: (value: TData | null) => void
}

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
                            onCheckedChange={(value) => {
                                row.toggleSelected(value === true)
                            }}
                            onClick={(event) => {
                                // stop event, prevent trigger the expand or other event
                                event.stopPropagation()
                            }}
                            aria-label='Select row'
                            className='translate-y-0.5'
                        />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                }
            } else if (header.key === 'data-table-expand') {
                return {
                    id: 'expand',
                    header: ({ table }) => (
                        <Button variant={'ghost'} title="收起" onClick={() => table.toggleAllRowsExpanded(false)}>
                            <ChevronsRight />
                        </Button>
                    ),
                    cell: ({ row }) => (
                        <Button variant={'ghost'} title={row.getIsExpanded() ? '收起' : '展开'} onClick={() => row.toggleExpanded(!row.getIsExpanded())}>
                            <ChevronRight className={row.getIsExpanded() ? 'rotate-90' : ''}/>
                        </Button>
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
    }, [entity.headers, setOpen, setCurrentRow])

    const table = useReactTable<TData>({
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
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
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
        <DataTableContext
            value={{ entity, table, loading, refetchHandler } as DataTableProviderState<unknown>}
        >
            {children}
        </DataTableContext>
    )
}

