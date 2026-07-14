import { ConfirmDialog } from "@/components/confirm-dialog";
import { useState } from "react";
import { SourcesMutateDialog } from "./sources-mutate-dialog";
import { useSources } from "./sources-provider";

export function SourcesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, deleteById } = useSources()

  const [isLoading, setIsLoading] = useState(false)

  if (!currentRow) {
    return (
      <SourcesMutateDialog
        key='source-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(null)}
      />
    )
  }

  return (
    <>
      <SourcesMutateDialog
        key={`source-update-${currentRow.id}`}
        open={open === 'update'}
        onOpenChange={() => {
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        currentRow={currentRow}
      />

      <ConfirmDialog
        key='source-delete'
        destructive
        isLoading={isLoading}
        open={open === 'delete'}
        onOpenChange={() => {
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        handleConfirm={async () => {
          setIsLoading(true)
          try {
            await deleteById(currentRow.id)
          } finally {
            setIsLoading(false)
          }
        }}
        className='max-w-md'
        title={`Delete this source: ${currentRow.id} ?`}
        desc={
          <>
            You are about to delete a source with the ID{' '}
            <strong>{currentRow.id}</strong>. <br />
            This action cannot be undone.
          </>
        }
        confirmText='Delete'
      />
    </>
  )
}
