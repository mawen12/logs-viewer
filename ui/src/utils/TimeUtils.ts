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