import { cn } from '@/lib/utils';

type MainProps = React.HTMLAttributes<HTMLElement> & {
  compact?: boolean,
  ref?: React.Ref<HTMLElement>
}

export function Main({ className, compact, ...props }: MainProps) {
  return (
    <main
      className={cn(
        'w-full',
        compact && 'max-w-7xl mx-auto',
        className
      )}
      {...props}
    />
  )
}
