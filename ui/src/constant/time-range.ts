export const TIMERANGE_OPTIONS = [
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
] as const

export type TimeRangeValue = (typeof TIMERANGE_OPTIONS)[number]['value']

export const TIMERANGE_LABELS: Record<TimeRangeValue, string> = Object.fromEntries(
    TIMERANGE_OPTIONS.map((option) => [option.value, option.label])
) as Record<TimeRangeValue, string>

export function isTimeRangeValue(value: string): value is TimeRangeValue {
    return TIMERANGE_OPTIONS.some((option) => option.value === value)
}

export type Mode = 'absolute' | 'last'