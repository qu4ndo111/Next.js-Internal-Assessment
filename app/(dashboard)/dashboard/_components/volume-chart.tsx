"use client"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/src/components/ui/chart"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"

export default function VolumeChart({ volumeData }: { volumeData: { month: number, volume: number }[] }) {
    const t = useTranslations("Dashboard");
    const tCommon = useTranslations("Common");

    if (!volumeData || volumeData.length === 0) {
        return (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                {tCommon("noData")}
            </div>
        )
    }

    const chartConfig = {
        volume: {
            label: t("volumeLabel"),
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart
                accessibilityLayer
                data={volumeData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(month) => `${t("month")} ${month}`}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                />
                <Bar
                    dataKey="volume"
                    radius={[6, 6, 0, 0]}
                    fill="var(--color-volume)"
                    maxBarSize={56}
                />
            </BarChart>
        </ChartContainer>
    )
}