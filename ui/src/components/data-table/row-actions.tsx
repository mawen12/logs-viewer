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
}

export function DataTableRowActions<TData>({
  row,
  setOpen,
  setCurrentRow,
}: DataTableRowActionsProps<TData>) {

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          onClick={(event) => {event.stopPropagation()}}
        >
          <Ellipsis className='size-4'/>
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          onClick={(event) => {
            setCurrentRow(row.original)
            setOpen('update')
            event.stopPropagation()
          }}
          className='cursor-pointer'
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={(event) => {
            setCurrentRow(row.original)
            setOpen('delete')
            event.stopPropagation()
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
