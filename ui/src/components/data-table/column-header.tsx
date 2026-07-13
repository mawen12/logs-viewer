import { type Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDown, ArrowUp } from 'lucide-react';

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>
    title: string
  }

/**
 * 通用的列 header 组件，支持普通列、列排序、列隐藏操作
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  // 如果列不允许排序，则直接展示 title
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    // flex items-center: flexbox 布局，垂直居中 
    // space-x-2: x 轴子项间距 8px
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* 允许排序的列，使用 Button 展示 */}
          <Button
            variant='ghost'
            size='sm'
            // h-8: 高度 32px
            // data-[state=open]:bg-accent: 读取 dropdown 的 state，打开之后，背景颜色变为 accent，用于醒目提醒
            className='h-8 data-[state=open]:bg-accent'
          >
            <span>{title}</span>
            {/* 根据排序展示对应图标：desc -> arrow-down, asc -> arrow-up, 无 -> caret-sort */}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className='ms-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className='ms-2 h-4 w-4' />
            ) : (
              // <CaretSort className='ms-2 h-4 w-4' />
              <ArrowUp className='ms-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {/* asc 排序 */}
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className='size-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          {/* desc 排序 */}
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className='size-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          {/* 如果列可以隐藏，则展示 hide 按钮 */}
          {column.getCanHide() && (
            <>
              {/* 分割线 */}
              <DropdownMenuSeparator />
              {/* hide 按钮 */}
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                {/* <EyeNoneIcon className='size-3.5 text-muted-foreground/70' /> */}
                <ArrowUp className='size-3.5 text-muted-foreground/70' />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
