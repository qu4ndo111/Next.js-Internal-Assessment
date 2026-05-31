"use client"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/src/components/ui/chart"
import { Pie, PieChart } from "recharts"
import { useTranslations } from "next-intl"

const TYPE_COLORS: Record<string, string> = {
    MEDICAL: "var(--chart-3)",
    ACCIDENT: "var(--chart-1)",
    PROPERTY: "var(--chart-2)",
    DEATH: "var(--chart-5)",
    DISABILITY: "var(--chart-4)",
}

export default function TypeDistributionChart({ typeDistributionData }: { typeDistributionData: { type: string, value: number }[] }) {
    const t = useTranslations("ClaimType");
    const tCommon = useTranslations("Common");

    if (!typeDistributionData || typeDistributionData.length === 0) {
        return (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                {tCommon("noData")}
            </div>
        )
    }

    const chartConfig = Object.fromEntries(
        Object.keys(TYPE_COLORS).map((key) => [
            key,
            { label: t(key), color: TYPE_COLORS[key] },
        ])
    ) satisfies ChartConfig

    const pieChartData = typeDistributionData.map(item => ({
        ...item,
        label: t(item.type) ?? item.type,
        fill: TYPE_COLORS[item.type] ?? "#94a3b8",
    }));


    const total = pieChartData.reduce((sum, d) => sum + d.value, 0)

    return (
        <div className="flex flex-col gap-2 h-[240px] w-full min-w-0">
            <ChartContainer className="w-full h-[180px]" config={chartConfig}>
                <PieChart>
                    <ChartTooltip
                        content={<ChartTooltipContent nameKey="label" hideLabel />}
                        cursor={false}
                    />
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="100%"
                        paddingAngle={3}
                        strokeWidth={0}
                    />
                </PieChart>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 px-1 shrink-0">
                {pieChartData.map((item) => (
                    <div key={item.type} className="flex items-center gap-2 min-w-0">
                        <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{item.label}</span>
                        <span className="ml-auto text-xs font-semibold tabular-nums shrink-0">
                            {Math.round((item.value / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}