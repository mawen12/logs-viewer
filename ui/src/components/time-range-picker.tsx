import { IconClockHour5 } from "@tabler/icons-react";
import { useState } from "react";
import { TimePicker } from "./time-picker";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const timeSections = [
    { value: '5m', label: '最近 5 分钟' },
    { value: '15m', label: '最近 15 分钟' },
    { value: '30m', label: '最近 30 分钟' },
    { value: '1h', label: '最近 1 小时' },
    { value: '3h', label: '最近 3 小时' },
    { value: '6h', label: '最近 6 小时' },
    { value: '12h', label: '最近 12 小时' },
    { value: '24h', label: '最近 1 天' },
    { value: '3d', label: '最近 3 天' },
    { value: '7d', label: '最近 7 天' }
]

export function TimeRangePicker() {
    const [selected, setSelected] = useState(timeSections[0].value)
    // const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" >
                    <IconClockHour5 />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0" align={'center'}>
                <div className='flex flex-row gap-2'>
                    <div className="flex flex-col items-start space-y-2 p-2">
                        <TimePicker id="time-picker-start" label="开始时间" value={startTime} setValue={setStartTime} />
                        <TimePicker id="time-picker-end" label="结束时间" value={endTime} setValue={setEndTime} />
                        <Button variant={'outline'} className="w-full">
                            确定
                        </Button>
                        <Button variant={'default'} className='w-full'>
                            取消
                        </Button>
                    </div>

                    <Separator orientation={'vertical'} />

                    <ScrollArea className="h-54 w-36 rounded-md space-y-2">
                        <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
                            {timeSections.map((section) => (
                                <DropdownMenuRadioItem key={section.value} value={section.value} className="p-2 whitespace-nowrap">
                                    {section.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </ScrollArea>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}