"use client"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/src/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"

export default function ProcessingTimeChart({ processingTimeData }: { processingTimeData: { month: string, avgDays: number, target: number }[] }) {
    const t = useTranslations("Dashboard");

    const chartConfig = {
        avgDays: {
            label: t("avgDaysLabel"),
            color: "var(--chart-2)",
        },
        target: {
            label: t("targetLabel"),
            color: "var(--chart-4)",
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <LineChart
                accessibilityLayer
                data={processingTimeData}
                margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                    unit="d"
                    domain={[0, 8]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                    dataKey="avgDays"
                    type="monotone"
                    stroke="var(--color-avgDays)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "var(--color-avgDays)" }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    dataKey="target"
                    type="monotone"
                    stroke="var(--color-target)"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    )
}