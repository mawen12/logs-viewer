import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/time";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

export type TimePickerFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    field: ControllerRenderProps<TFieldValues, TName>
    invalid: boolean
}

export function TimePickerField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, invalid }: TimePickerFieldProps<TFieldValues, TName>) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [month, setMonth] = useState<Date | undefined>(date)

    return (
        <InputGroup>
            <InputGroupInput
                {...field}
                aria-invalid={invalid}
                type={'datetime'}
                step="1"
                autoComplete="off"
                onChange={(e) => {
                    const nextValue = e.target.value
                    const nextDate = fromDateTimeLocalValue(nextValue)
                    console.log(nextValue.length)
                    // setValue(nextValue)
                    field.onChange(nextValue)
                    console.log(nextValue)
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
                                // setValue(toDateTimeLocalValue(nextDate))
                                field.onChange(toDateTimeLocalValue(nextDate))
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </InputGroupAddon>
        </InputGroup>
    )
}