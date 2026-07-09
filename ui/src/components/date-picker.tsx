import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Fragment } from 'react';

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
}

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Pick a date',
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!selected}
          className='w-60 justify-start text-start font-normal data-[empty=true]:text-muted-foreground'
        >
          {selected ? (
            format(selected, 'MMM d, yyyy')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div className='flex flex-row'>
          <Calendar
            mode='single'
            captionLayout='dropdown'
            selected={selected}
            onSelect={onSelect}
            disabled={(date: Date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
          />
          <Separator orientation={'vertical'} className='h-4' />
          <ScrollArea className="h-64 w-48 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
              {tags.map((tag) => (
                <Fragment key={tag}>
                  <div className="text-sm">{tag}</div>
                  <Separator className="my-2" />
                </Fragment>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
