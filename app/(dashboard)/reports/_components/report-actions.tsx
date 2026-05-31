"use client"

import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { useTranslations } from "next-intl"
import { FileDown } from "lucide-react"
import { AssessorReportRow, MonthlyReportRow } from "@/src/types/report"

export default function ReportActions({ tab, monthlyData, assessorData }: { tab: string, monthlyData?: MonthlyReportRow[], assessorData?: AssessorReportRow[] }) {
    const t = useTranslations("Reports")
    const tCsvMonthly = useTranslations("Reports.monthlyTable")
    const tCsvAssessor = useTranslations("Reports.assessorTable")

    const escapeCell = (val: any) => {
        if (val === null || val === undefined) return "";
        return `"${String(val).replace(/"/g, '""')}"`;
    };

    const exportMonthlyCsv = () => {
        const headers = [
            tCsvMonthly("month"),
            tCsvMonthly("total"),
            tCsvMonthly("approved"),
            tCsvMonthly("rejected"),
            tCsvMonthly("inProgress"),
            tCsvMonthly("avgDays"),
            tCsvMonthly("claimedAmount"),
            tCsvMonthly("assessedAmount")
        ];

        const csvContent = [
            headers.map(escapeCell).join(','),
            ...monthlyData!.map((row: MonthlyReportRow) => [
                row.month, 
                row.total, 
                row.approved, 
                row.rejected, 
                row.inProgress, 
                row.avgDays !== null ? `${row.avgDays}d` : "-", 
                row.claimedAmount, 
                row.assessedAmount
            ].map(escapeCell).join(','))
        ].join('\n');

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `monthly-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportAssessorCsv = () => {
        const headers = [
            tCsvAssessor("assessor"),
            tCsvAssessor("total"),
            tCsvAssessor("approved"),
            tCsvAssessor("rejected"),
            tCsvAssessor("inProgress"),
            tCsvAssessor("avgDays"),
            tCsvAssessor("sla"),
        ];

        const csvContent = [
            headers.map(escapeCell).join(','),
            ...assessorData!.map((row: AssessorReportRow) => [
                row.assessor, 
                row.total, 
                row.approved, 
                row.rejected, 
                row.inProgress, 
                row.avgDays !== null ? `${row.avgDays}d` : "-", 
                `${row.sla}%`
            ].map(escapeCell).join(','))
        ].join('\n');

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `assessor-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
          <div className="flex items-center justify-end gap-4">
            {tab === "monthly" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-medium border-dashed"
                  onClick={() => exportMonthlyCsv()}
                >
                  <FileDown className="mr-1.5 h-3.5 w-3.5" />
                  {t("exportCsv")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-medium border-dashed"
                  onClick={() => exportAssessorCsv()}
                >
                  <FileDown className="mr-1.5 h-3.5 w-3.5" />
                  {t("exportCsv")}
                </Button>
              </>
            )}
          </div>
          <Separator className="my-4" />
        </div>
    )
}