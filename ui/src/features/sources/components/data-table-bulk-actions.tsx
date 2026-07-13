import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Table } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SourcesMultiDeleteDialog } from './tasks-multi-delete-dialog';

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  title: string
}

export function DataTableBulkActions<TData>({
  table,
  title,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  
  return (
    <>
      <BulkActionsToolbar table={table} entityName='source'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={title}
              title={title}
            >
              <Trash2 />
              <span className='sr-only'>{title}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <SourcesMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
