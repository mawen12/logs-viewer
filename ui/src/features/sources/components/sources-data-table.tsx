import { useGetSourceQuery } from '@/api/sources/getSource';
import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDataTable } from '@/contexts/use-datatable';
import { cn } from '@/lib/utils';
import type { DataTableEntity } from '@/types/data-table';
import {
  flexRender,
  type Row
} from '@tanstack/react-table';
import type { Source } from '../data/schema';
import { DataTableBulkActions } from './data-table-bulk-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SourcesDataTable() {
  const { entity, table } = useDataTable()
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter by name or gruop...'
      />
      <div className='flex h-full min-h-0 flex-1 overflow-hidden rounded-md border'>
        <Table className='min-h-0 flex-1 '>
          <TableHeader className='top-0 sticky bg-white dark:bg-black z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                table.getRowModel().rows.map((row) => (
                  <DataTableRow key={row.id} row={row} entity={entity} />
                ))
              )
              : (
                <EmptyTableRow cols={table.getAllColumns().length} />
              )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mb-4' />
      <DataTableBulkActions table={table} title='Delete selected tasks' />
    </div>
  )
}

function DataTableRow<TData>({ row, entity }: { row: Row<TData>, entity: DataTableEntity<TData> }) {
  return (
    <>
      <TableRow
        data-state={row.getIsSelected() && 'selected'}
        onClick={() => row.toggleExpanded(!row.getIsExpanded())}
        className={row.getIsExpanded() ? 'bg-muted' : ''}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(
              cell.column.columnDef.meta?.className,
              cell.column.columnDef.meta?.tdClassName
            )}
          >
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </TableCell>
        ))}
      </TableRow>
      {row.getIsExpanded() && entity.rowAction?.component(row)}
    </>
  )
}

export function DataTableDetailRow({ row }: { row: Row<Source> }) {
  const { data, isFetching } = useGetSourceQuery({ id: row.original.id },)

  return (
    <TableRow>
      <TableCell
        colSpan={row.getAllCells().length}
        className='h-24 border'
      >
        {isFetching
          ? <Skeleton className='w-full h-full' />
          : (data
            ?
            <Card>
              <CardHeader className='item-start'>
                <CardTitle>{data.group}/{data.name}</CardTitle>
                <CardDescription>{data.source}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='grid grid-cols-2'>
                  <div>
                    <div className='text-sm font-bold'>Pattern:</div>
                    <div className='pl-2'>{data.pattern}</div>
                  </div>
                  <div>
                    <div className='text-sm font-bold'>Time zone:</div>
                    <div className='pl-2'>{data?.timezone}</div>
                  </div>
                </div>
                <div>
                  <div className='text-sm font-bold'>First Log line:</div>
                  <div className='pl-2'>{data?.firstLogLine}</div>
                </div>
                <div>
                  <div className='text-sm font-bold'>Last Log line:</div>
                  <div className='pl-2'>{data?.lastLogLine}</div>
                </div>
              </CardContent>
            </Card>
            : <h1></h1>
          )}

      </TableCell>
    </TableRow>
  )
}

function EmptyTableRow({ cols }: { cols: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={cols}
        className='h-24 text-center'
      >
        No results.
      </TableCell>
    </TableRow>
  )
} 