import { isTimeRangeValue, TIMERANGE_LABELS, TIMERANGE_OPTIONS, type Mode, type TimeRangeValue } from "@/constant/time-range";
import { toDateTimeLocalValue } from "@/lib/time";
import { useQueryStore } from "@/store/use-query-store";
import { IconClockHour5 } from "@tabler/icons-react";
import { Calendar } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { TimeRangeForm } from "./time-range-form";

export type TimeRange = {
    mode: Mode
    start: TimeRangeValue | string
    end?: string
}

function toRangeMs(value: TimeRangeValue) {
    const amount = parseInt(value, 10)

    if (value.endsWith('m')) {
        return amount * 60 * 1000
    }

    if (value.endsWith('h')) {
        return amount * 60 * 60 * 1000
    }

    if (value.endsWith('d')) {
        return amount * 24 * 60 * 60 * 1000
    }

    return 0
}

function buildRange(value: TimeRangeValue) {
    const now = new Date()
    const start = new Date(now.getTime() - toRangeMs(value))

    return {
        start: toDateTimeLocalValue(start),
        end: toDateTimeLocalValue(now),
    }
}

export function TimeRangePicker() {
    const { timeRange, setTimeRange, startTime, setStartTime, endTime, setEndTime } = useQueryStore()
    const [open, setOpen] = useState(false)
    const [selected, _setSelected] = useState<TimeRangeValue | undefined>(TIMERANGE_OPTIONS[0].value)

    // 选择快捷时间范围 -> 更新 timeRange
    const setSelected = useCallback((value: string) => {
        if (isTimeRangeValue(value)) {
            _setSelected(value)
            setTimeRange({ mode: 'last', start: value })
        }
    }, [_setSelected, setTimeRange])

    // timeRange 变化时（包括外部修改），同步 startTime/endTime 和 selected
    useEffect(() => {
        if (timeRange.mode === 'last' && isTimeRangeValue(timeRange.start)) {
            const range = buildRange(timeRange.start as TimeRangeValue)
            setStartTime(range.start)
            setEndTime(range.end)
            _setSelected(timeRange.start as TimeRangeValue)
        } else if (timeRange.mode === 'absolute') {
            setStartTime(timeRange.start)
            setEndTime(timeRange.end ?? '')
            _setSelected(undefined)
        }
    }, [timeRange])

    // 表单提交绝对时间 -> 更新 timeRange
    const setStartEndTime = useCallback((startTime: string, endTime: string) => {
        setTimeRange({ mode: 'absolute', start: startTime, end: endTime })
        setOpen(false)
    }, [setTimeRange, setOpen])


    const label = useMemo((): string => {
        if (timeRange.mode == 'last') {
            return TIMERANGE_LABELS[timeRange.start]
        }
        return `${timeRange.start} - ${timeRange.end}`
    }, [timeRange])

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" >
                    {timeRange.mode === 'last' ? <IconClockHour5 /> : <Calendar />} {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0" align={'center'}>
                <div className='flex flex-row gap-2'>
                    <TimeRangeForm className="w-72" initStartTime={startTime} initEndTime={endTime} onSubmit={setStartEndTime} onCancel={() => setOpen(false)} />

                    <Separator orientation={'vertical'} />

                    <ScrollArea className="h-54 w-36 rounded-md space-y-2">
                        <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
                            {TIMERANGE_OPTIONS.map((section) => (
                                <DropdownMenuRadioItem key={section.value} value={section.value} className="p-2 whitespace-nowrap">
                                    {section.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </ScrollArea>
                </div>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}