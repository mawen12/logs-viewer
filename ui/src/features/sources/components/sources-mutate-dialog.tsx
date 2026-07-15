import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { type Source } from '../data/schema';
import { useSources } from './sources-provider';

type SourceMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Source
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(10, 'Name must less than 10'),
  group: z.string().min(1, 'Group is required.'),
  source: z.string().min(1, 'Source is required.'),
  pattern: z.string().min(1, 'Pattern is required')
})
type SourceForm = z.infer<typeof formSchema>

export function SourcesMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: SourceMutateDialogProps) {
  const {  add, update } = useSources()

  const isUpdate = !!currentRow

  const form = useForm<SourceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
      group: '',
      source: '',
      pattern: '',
    },
  })

  const onSubmit = async (data: SourceForm) => {
    if (isUpdate) {
      await update({ ...data, id: currentRow.id })
    } else {
      await add(data)
    }
    // do something with the form data
    onOpenChange(false)
    form.reset()
    console.log(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      {/* className='flex-1 space-y-6 overflow-y-auto px-4' */}
      <form id="sources-form" onSubmit={form.handleSubmit(onSubmit)} >
        <DialogContent className='w-full'>
          <DialogHeader>
            <DialogTitle>{isUpdate ? 'Update' : 'Create'} Source</DialogTitle>
            <DialogDescription>
              {isUpdate
                ? 'Update the source by providing necessary info.'
                : 'Add a new source by providing necessary info.'}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} placeholder='Enter a name' />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='group'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Group</FieldLabel>
                <Input {...field} placeholder='Enter a group' />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='source'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Source</FieldLabel>
                <Input {...field} placeholder='Enter a source' />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='pattern'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Pattern</FieldLabel>
                <Input {...field} placeholder='Enter a pattern' />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className='gap-2'>
            <DialogClose asChild>
              <Button variant='outline'>Close</Button>
            </DialogClose>
            <Button form='sources-form' type='submit'>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog >
  )
}
