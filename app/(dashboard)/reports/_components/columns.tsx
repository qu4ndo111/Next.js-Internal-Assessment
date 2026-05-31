"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AssessorReportRow, MonthlyReportRow } from "@/src/types/report"
import { useTranslations } from "next-intl"

export const monthlyColumns: ColumnDef<MonthlyReportRow>[] = [
    {
        accessorKey: "month",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="font-semibold">{t("month")}</div>
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("month")}</div>
    },
    {
        accessorKey: "total",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-center font-semibold">{t("total")}</div>
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("total")}</div>
    },
    {
        accessorKey: "approved",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-center text-green-600 dark:text-green-400 font-semibold">{t("approved")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-green-600 dark:text-green-400">{row.getValue("approved")}</div>
    },
    {
        accessorKey: "rejected",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-center text-red-600 dark:text-red-400 font-semibold">{t("rejected")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-red-600 dark:text-red-400">{row.getValue("rejected")}</div>
    },
    {
        accessorKey: "inProgress",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-center text-blue-600 dark:text-blue-400 font-semibold">{t("inProgress")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-blue-600 dark:text-blue-400">{row.getValue("inProgress")}</div>
    },
    {
        accessorKey: "avgDays",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-center font-semibold">{t("avgDays")}</div>
        },
        cell: ({ row }) => {
            const val = row.getValue("avgDays");
            return <div className="text-center font-medium">{val !== null ? `${val}d` : "-"}</div>
        }
    },
    {
        accessorKey: "claimedAmount",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-right font-semibold">{t("claimedAmount")}</div>
        },
        cell: function Cell({ row }) {
            const amount = parseFloat(row.getValue("claimedAmount"))
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount)
            return <div className="text-right font-semibold text-primary">{formatted}</div>
        },
    },
    {
        accessorKey: "assessedAmount",
        header: function Header() {
            const t = useTranslations("Reports.monthlyTable")
            return <div className="text-right font-semibold">{t("assessedAmount")}</div>
        },
        cell: function Cell({ row }) {
            const amount = parseFloat(row.getValue("assessedAmount"))
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount)
            return <div className="text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatted}</div>
        },
    }
]

export const assessorColumns: ColumnDef<AssessorReportRow>[] = [
    {
        accessorKey: "assessor",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="font-semibold">{t("assessor")}</div>
        },
        cell: ({ row }) => <div className="font-semibold text-foreground/90">{row.getValue("assessor")}</div>
    },
    {
        accessorKey: "total",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center font-semibold">{t("total")}</div>
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("total")}</div>
    },
    {
        accessorKey: "approved",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center text-green-600 dark:text-green-400 font-semibold">{t("approved")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-green-600 dark:text-green-400">{row.getValue("approved")}</div>
    },
    {
        accessorKey: "rejected",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center text-red-600 dark:text-red-400 font-semibold">{t("rejected")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-red-600 dark:text-red-400">{row.getValue("rejected")}</div>
    },
    {
        accessorKey: "inProgress",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center text-blue-600 dark:text-blue-400 font-semibold">{t("inProgress")}</div>
        },
        cell: ({ row }) => <div className="text-center font-medium text-blue-600 dark:text-blue-400">{row.getValue("inProgress")}</div>
    },
    {
        accessorKey: "avgDays",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center font-semibold">{t("avgDays")}</div>
        },
        cell: ({ row }) => {
            const val = row.getValue("avgDays");
            return <div className="text-center font-medium">{val !== null ? `${val}d` : "-"}</div>
        }
    },
    {
        accessorKey: "sla",
        header: function Header() {
            const t = useTranslations("Reports.assessorTable")
            return <div className="text-center font-semibold">{t("sla")}</div>
        },
        cell: ({ row }) => {
            const sla = row.getValue("sla") as number
            let badgeColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            if (sla < 80) {
                badgeColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            } else if (sla < 90) {
                badgeColor = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            }
            return (
                <div className="flex justify-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {sla}%
                    </span>
                </div>
            )
        }
    }
]