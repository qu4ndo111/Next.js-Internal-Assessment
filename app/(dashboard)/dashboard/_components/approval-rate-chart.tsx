"use client"

import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { useTranslations } from "next-intl"

const STATUS_COLORS: Record<string, string> = {
    APPROVED: "var(--chart-2)", // teal
    PARTIALLY_APPROVED: "var(--chart-3)", // blue
    REJECTED: "var(--chart-5)", // red
    PENDING: "var(--chart-1)", // amber
    IN_REVIEW: "var(--chart-4)",
    ADDITIONAL_INFO_REQUESTED: "var(--chart-4)",
}

export default function ApprovalRateChart({ approvalRateData }: { approvalRateData: { status: string, value: number }[] }) {
    const t = useTranslations("Assessments.status");
    const tCommon = useTranslations("Common");

    if (!approvalRateData || approvalRateData.length === 0) {
        return (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                {tCommon("noData")}
            </div>
        )
    }

    const total = approvalRateData.reduce((acc, item) => acc + item.value, 0);

    const chartData = approvalRateData.map((item) => ({
        label: t(item.status),
        value: total > 0 ? Math.round((item.value / total) * 100) : 0,
        count: item.value,
        fill: STATUS_COLORS[item.status] ?? "hsl(var(--chart-4))",
    }))

    return (
        <div className="flex flex-col gap-3 h-[260px]">
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={14}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            tick={false}
                        />
                        <RadialBar
                            dataKey="value"
                            cornerRadius={6}
                            background={{ fill: "hsl(var(--muted))" }}
                            label={false}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1 shrink-0">
                {chartData.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 min-w-0">
                        <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{item.label}</span>
                        <span className="ml-auto text-xs font-semibold tabular-nums shrink-0">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
