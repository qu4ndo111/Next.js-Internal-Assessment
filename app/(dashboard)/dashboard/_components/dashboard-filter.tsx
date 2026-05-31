"use client"

import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { Assessment } from "@/src/types/assessment";

type PeriodType = "filter6Months" | "filterThisYear" | "filter12Months"

export default function DashboardFilter({ data = [] }: { data?: Assessment[] }) {
    const t = useTranslations("Dashboard");
    const tAssessments = useTranslations("Assessments");
    const tClaimType = useTranslations("ClaimType");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const period = searchParams.get("period") as PeriodType || "filter6Months";
    const type = searchParams.get("type") || "all";

    const periodFilters = [
        { key: "filter6Months", label: t("filter6Months") },
        { key: "filterThisYear", label: t("filterThisYear") },
        { key: "filter12Months", label: t("filter12Months") }
    ];

    const handlePeriodFilterChange = (filter: PeriodType) => {
        const time = new Date()
        const params = new URLSearchParams(searchParams.toString());
        let from = "";
        let to = "";
        if (filter === 'filter6Months') {
            const last6Months = new Date()
            last6Months.setMonth(time.getMonth() - 6);
            from = new Date(last6Months).toISOString().split('T')[0];
            to = time.toISOString().split('T')[0];
        } else if (filter === 'filterThisYear') {
            from = new Date(time.getFullYear(), 0, 1).toISOString().split('T')[0];
            to = time.toISOString().split('T')[0];
        } else if (filter === 'filter12Months') {
            const last12Months = new Date()
            last12Months.setMonth(time.getMonth() - 11);
            from = last12Months.toISOString().split('T')[0];
            to = time.toISOString().split('T')[0];
        }
        params.set("period", filter);
        params.set("from", from);
        params.set("to", to);
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleTypeFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter === "all") {
            params.delete("type");
        } else {
            params.set("type", filter);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleExport = () => {
        const tCsv = (key: string) => tAssessments(`csvHeaders.${key}`);
        
        const headers = [
            tCsv("profileId"),
            tCsv("claimId"),
            tCsv("type"),
            tCsv("status"),
            tCsv("claimedAmount"),
            tCsv("submittedAt"),
            tCsv("processingDays")
        ];

        const csvContent = [
            headers.join(","),
            ...data.map(d => [
                d.id,
                d.claimId,
                tClaimType(d.claimType),
                tAssessments(`status.${d.status}`),
                d.claimedAmount,
                d.submittedAt,
                d.processingDays ?? ""
            ].join(","))
        ].join("\n");
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `AQ-Portal-Report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center rounded-lg border bg-muted/50 p-1 gap-0.5 w-full sm:w-auto justify-between sm:justify-start">
                {periodFilters.map((filter) => (
                    <button
                        key={filter.key}
                        className={cn(
                            "flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all text-nowrap text-center",
                            filter.key === period
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => handlePeriodFilterChange(filter.key as PeriodType)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <Select value={type} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px] justify-between">
                    <SelectValue placeholder={tAssessments("filter.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value="all">{tClaimType("ALL") || "Tất cả"}</SelectItem>
                    <SelectItem value="MEDICAL">{tClaimType("MEDICAL")}</SelectItem>
                    <SelectItem value="ACCIDENT">{tClaimType("ACCIDENT")}</SelectItem>
                    <SelectItem value="PROPERTY">{tClaimType("PROPERTY")}</SelectItem>
                    <SelectItem value="DEATH">{tClaimType("DEATH")}</SelectItem>
                    <SelectItem value="DISABILITY">{tClaimType("DISABILITY")}</SelectItem>
                </SelectContent>
            </Select>
            <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9 w-full sm:w-auto justify-center sm:justify-start shrink-0" 
                onClick={handleExport} 
                disabled={data.length === 0}
            >
                <Download className="h-3.5 w-3.5" />
                {t("exportReport")}
            </Button>
        </div>
    )
}