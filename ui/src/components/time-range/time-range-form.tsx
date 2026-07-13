import { zodResolver } from "@hookform/resolvers/zod";
import { type HTMLAttributes } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { TimePickerField } from "./time-picker-field";
import { cn } from "@/lib/utils";

const DATE_TIME_FORMAT_HINT = "时间格式必须为 YYYY-MM-DD HH:mm:ss"

function isStrictDateTime(value: string) {
    const matched = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value)
    if (!matched) {
        return false
    }

    const year = Number(matched[1])
    const month = Number(matched[2])
    const day = Number(matched[3])
    const hour = Number(matched[4])
    const minute = Number(matched[5])
    const second = Number(matched[6])

    const date = new Date(year, month - 1, day, hour, minute, second)

    return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day &&
        date.getHours() === hour &&
        date.getMinutes() === minute &&
        date.getSeconds() === second
    )
}

const dateTimeSchema = z
    .string()
    .trim()
    .min(1, "Please select or enter date time")
    .refine(isStrictDateTime, {
        message: DATE_TIME_FORMAT_HINT,
    })

const formSchema = z.object({
    startTime: dateTimeSchema,
    endTime: dateTimeSchema,
})

interface TimeRangeFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    initStartTime?: string
    initEndTime?: string
    onSubmit: (startTime: string, endTime: string) => void
    onCancel: () => void
}

type Form = z.infer<typeof formSchema>

export function TimeRangeForm({ className, initStartTime, initEndTime, onSubmit, onCancel, ...props }: TimeRangeFormProps) {
    const form = useForm<Form>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startTime: initStartTime ?? '',
            endTime: initEndTime ?? '',
        }
    })

    function submitHandler(data: Form) {
        onSubmit(data.startTime, data.endTime)
    }

    return (
        <form onSubmit={form.handleSubmit(submitHandler)} className={cn("flex flex-col items-start space-y-2 p-2", className)} {...props}>
            <Controller
                control={form.control}
                name='startTime'
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>开始时间</FieldLabel>
                        <TimePickerField field={field} invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                control={form.control}
                name='endTime'
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>结束时间</FieldLabel>
                        <TimePickerField field={field} invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Button type="submit" variant={'outline'} className="w-full">
                确定
            </Button>
            <Button type="button" variant={'default'} className='w-full' onClick={onCancel}>
                取消
            </Button>
        </form>
    )
}