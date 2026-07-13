import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { type Row } from '@tanstack/react-table';
import { Ellipsis, Trash2 } from 'lucide-react';

export type DialogType = 'create' | 'update' | 'delete'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  setOpen: (str: DialogType | null) => void
  setCurrentRow: (row: TData) => void
  getCurrentRow?: (row: Row<TData>) => TData
}

export function DataTableRowActions<TData>({
  row,
  setOpen,
  setCurrentRow,
  getCurrentRow = (tableRow) => tableRow.original
}: DataTableRowActionsProps<TData>) {
  const currentRow = getCurrentRow(row)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <Ellipsis className='size-4'/>
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(currentRow)
            setOpen('update')
          }}
          className='cursor-pointer'
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => {
            setCurrentRow(currentRow)
            setOpen('delete')
          }}
          className='cursor-pointer'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
