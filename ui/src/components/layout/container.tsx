import { cn } from '@/lib/utils';

type ContainerProps = {
    children?: React.ReactNode
}

export function Container({ children }: ContainerProps) {
    return (
        <div
            className={cn(
                'h-svh',
                'h-[calc(100svh-(var(--spacing)*4))]',
                // 'flex grow flex-col overflow-hidden max-w-7xl mx-auto',
                'flex grow flex-col overflow-hidden'
            )}
        >
            {children}
        </div>
    )
}
