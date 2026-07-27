import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  compact?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, compact, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          compact && 'max-w-7xl mx-auto',
          offset > 10 && fixed && 'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger variant='outline' className='size-8 max-md:scale-125' />

        <Separator orientation='vertical' className='h-8' />
        {children}
      </div>
    </header>
  )
}
