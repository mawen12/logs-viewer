import { useEffect, useState, type HTMLAttributes } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceArea, XAxis, YAxis } from "recharts";
import type { ChartData } from "recharts/types/state/chartDataSlice";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { cn } from "@/lib/utils";
import { useLogs } from "@/features/home/components/logs-provider";
import { toDateTimeLocalValue } from "@/lib/time";
import { useLogStore } from "@/store/useLogStore";
import { useQueryStore } from "@/store/use-query-store";

export interface StatsChartProps extends HTMLAttributes<HTMLDivElement> {
    data?: ChartData<{
        time: number
        count: number
    }>,
    timeFormatter?: (timestamp: number) => string
}

const chartConfig = {
    count: {
        label: 'Count',
        color: '#60a5fa',
    }
} satisfies ChartConfig


export function StatsChart({
    className,
    data,
    timeFormatter = (timestamp) => new Date(timestamp).toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit',
    })
}: StatsChartProps) {
    const {refetch} = useLogs()
    const {setTimeRange} = useQueryStore()

    const [left, setLeft] = useState<number>()
    const [right, setRight] = useState<number>()
    const [isSelecting, setIsSelecting] = useState(false)

    return (
        <ChartContainer config={chartConfig} className={cn("aspect-auto h-62.5 w-full", className)}>
            <BarChart
                accessibilityLayer
                data={data}
                margin={{ left: 12, right: 12 }}
                // 鼠标按下
                onMouseDown={(nextState) => {
                    if (nextState?.activeLabel) {
                        // 模式一: 按下鼠标拖动选择
                        setIsSelecting(true)
                        setLeft(Number(nextState.activeLabel))
                        setRight(undefined)
                    }
                }}
                // 鼠标移动
                onMouseMove={(nextState) => {
                    if (isSelecting && nextState?.activeLabel) {
                        setRight(Number(nextState.activeLabel))
                    }
                }}
                // 鼠标完成
                onMouseUp={() => {
                    if (isSelecting) {
                        setIsSelecting(false)
                        if (left && right) {
                            setTimeRange({
                                mode: 'absolute',
                                start: toDateTimeLocalValue(new Date(left)),
                                end: toDateTimeLocalValue(new Date(right)),
                            })
                            setLeft(undefined)
                            setRight(undefined)
                            refetch()
                        }
                    }
                }}
                onDoubleClick={(nextState) => {
                    if (nextState?.activeLabel) {
                        // 模式一: 按下鼠标拖动选择
                        setIsSelecting(true)
                        setLeft(Number(nextState.activeLabel))
                        setRight(undefined)
                    }
                }}
            >
                {/* 网格线 */}
                <CartesianGrid vertical={true} />
                {/* X轴 */}
                <XAxis
                    dataKey="time"
                    // type="number"
                    // scale="time"
                    domain={['dataMin', 'dataMax']}
                    tickMargin={8}
                    minTickGap={32}
                    interval={"preserveStartEnd"}
                    tickFormatter={(value) => timeFormatter(value)}
                />
                {/* Y轴 */}
                <YAxis
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    width={48}
                    domain={['auto', 'auto']}
                    // 不显示小数点
                    allowDecimals={false}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="w-37.5"
                            nameKey="count"
                            labelFormatter={(value, payload) => {
                                const timestamp = payload?.[0]?.payload?.time;
                                return new Date(timestamp).toLocaleDateString('zh-CN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }}
                        />
                    }
                />
                <Bar
                    dataKey={'count'}
                    // stroke="#60a5fa"
                    // strokeWidth={2}
                    fill="#60a5fa"
                />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}

                {left && right && (
                    <ReferenceArea x1={left} x2={right} fill="skyblue" fillOpacity={0.3} />
                )}
            </BarChart>
        </ChartContainer>
    )
}