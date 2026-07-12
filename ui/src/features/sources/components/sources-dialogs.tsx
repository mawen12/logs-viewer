import { ConfirmDialog } from "@/components/confirm-dialog";
import { useSources } from "./sources-provider";
import { SourcesMutateDrawer } from "./sources-mutate-drawer";

export function SourcesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSources()
  return (
    <>
      <SourcesMutateDrawer
        key='source-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <SourcesMutateDrawer
            key={`source-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='source-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following source has been deleted:'
              )
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
      )}
    </>
  )
}
