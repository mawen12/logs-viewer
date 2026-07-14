import { Plus, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSources } from './sources-provider';
import { cn } from '@/lib/utils';

export function SourcesPrimaryButtons() {
  const { setOpen, refetch, isFetching } = useSources()
  return (
    <div className='flex gap-2'>
      <Button variant={'outline'} size={'lg'} title="Create" onClick={() => setOpen('create')}>
        <Plus size={18} /> Create
      </Button>
      <Button variant={'outline'} size={'lg'} title='Refresh' disabled={isFetching} onClick={() => refetch()}>
        <RefreshCcw className={cn(isFetching && 'animate-spin')} /> Refresh
      </Button>
    </div>
  )
}
