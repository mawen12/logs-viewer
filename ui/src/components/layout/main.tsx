import { cn } from '@/lib/utils';

type MainProps = React.HTMLAttributes<HTMLElement> & {
  compact?: boolean,
  fixed?: boolean,
  ref?: React.Ref<HTMLElement>
}

export function Main({ className, compact, fixed, ...props }: MainProps) {
  return (
    <main
      className={cn(
        'w-full',
        compact && 'max-w-7xl mx-auto',
        fixed && 'h-svh p-4',
        className
      )}
      {...props}
    />
  )
}
