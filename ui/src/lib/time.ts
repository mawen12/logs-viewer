import type { TimeParams } from "@/store/useTimeStore";
import dayjs from "dayjs";

const map: Record<string, dayjs.ManipulateType> = {
    m: "minute",
    h: 'hour',
    d: "day",
    y: "year"
}

export function strToDateTimeMinuteDash(input: string): TimeParams {
    const letter = input.slice(-1);
    const number = input.slice(0, -1);

    const now = Date.now()
    return {
        from: dayjs(now).subtract(Number(number), map[letter]).format("YYYY-MM-DD-HH:mm"),
        to: dayjs(now).format("YYYY-MM-DD-HH:mm")
    }
}

export function strToDateTimeMinute(input: string): TimeParams {
    const letter = input.slice(-1);
    const number = input.slice(0, -1);

    const now = Date.now()
    return {
        from: dayjs(now).subtract(Number(number), map[letter]).format("YYYY-MM-DD HH:mm"),
        to: dayjs(now).format("YYYY-MM-DD HH:mm")
    }
}

export function fromDateTimeLocalValue(value: string) {
    if (!value) {
        return undefined
    }

    const [datePart, timePart] = value.split("T")
    if (!datePart || !timePart) {
        return undefined
    }

    const [year, month, day] = datePart.split("-").map(Number)
    const [hour, minute] = timePart.split(":").map(Number)
    const date = new Date(year, month - 1, day, hour, minute)

    if (Number.isNaN(date.getTime())) {
        return undefined
    }

    return date
}

export function toDateTimeLocalValue(date: Date | undefined) {
    if (!date) {
        return ""
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day} ${hour}:${minute}`
}