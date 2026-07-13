import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { type Source } from '../data/schema';

type SourceMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Source
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(10, 'Name must less than 10'),
  group: z.string().min(1, 'Group is required.'),
  source: z.string().min(1, 'Source is required.'),
})
type SourceForm = z.infer<typeof formSchema>

export function SourcesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: SourceMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<SourceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
      group: '',
      source: '',
    },
  })

  const onSubmit = (data: SourceForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    console.log(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <form id="sources-form" onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6 overflow-y-auto px-4'>
        <SheetContent className='flex flex-col'>
          <SheetHeader className='text-start'>
            <SheetTitle>{isUpdate ? 'Update' : 'Create'} Source</SheetTitle>
            <SheetDescription>
              {isUpdate
                ? 'Update the source by providing necessary info.'
                : 'Add a new source by providing necessary info.'}
              Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
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
          <SheetFooter className='gap-2'>
            <SheetClose asChild>
              <Button variant='outline'>Close</Button>
            </SheetClose>
            <Button form='sources-form' type='submit'>
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </form>
    </Sheet >
  )
}
