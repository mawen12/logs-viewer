import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Field, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function toDateTimeLocalValue(date: Date | undefined) {
    if (!date) {
        return ""
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")
    const second = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function fromDateTimeLocalValue(value: string) {
    if (!value) {
        return undefined
    }

    const [datePart, timePart] = value.split("T")
    if (!datePart || !timePart) {
        return undefined
    }

    const [year, month, day] = datePart.split("-").map(Number)
    const [hour, minute, second = 0] = timePart.split(":").map(Number)
    const date = new Date(year, month - 1, day, hour, minute, second)

    if (Number.isNaN(date.getTime())) {
        return undefined
    }

    return date
}

export type TimePickerProps = {
    label: string
    id: string
    value: string
    setValue: (value: string) => void
}

export function TimePicker({ id, label, value, setValue }: TimePickerProps) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [month, setMonth] = useState<Date | undefined>(date)
    // const [value, setValue] = useState(toDateTimeLocalValue(date))

    return (
        <Field className="w-full px-1">
            <FieldLabel className="shrink-0 whitespace-nowrap" htmlFor={id}>
                {label}
            </FieldLabel>
            <InputGroup>
                <InputGroupInput
                    type={'datetime'}
                    id={id}
                    step="1"
                    value={value}
                    onChange={(e) => {
                        const nextValue = e.target.value
                        const nextDate = fromDateTimeLocalValue(nextValue)
                        setValue(nextValue)
                        if (nextDate) {
                            setDate(nextDate)
                            setMonth(nextDate)
                        }
                    }}
                />
                <InputGroupAddon align={"inline-end"}>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <InputGroupButton id="date-picker" variant="ghost" size="icon-xs" aria-label="Select date">
                                <CalendarIcon />
                                <span className="sr-only">Select date</span>
                            </InputGroupButton>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                        >
                            <Calendar
                                locale={zhCN}
                                mode="single"
                                captionLayout={'dropdown'}
                                selected={date}
                                month={month}
                                onMonthChange={setMonth}
                                onSelect={(nextDay) => {
                                    if (!nextDay) {
                                        return
                                    }

                                    const base = date ?? new Date()
                                    const nextDate = new Date(nextDay)
                                    nextDate.setHours(
                                        base.getHours(),
                                        base.getMinutes(),
                                        base.getSeconds(),
                                        0,
                                    )

                                    setDate(nextDate)
                                    setMonth(nextDate)
                                    setValue(toDateTimeLocalValue(nextDate))
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}