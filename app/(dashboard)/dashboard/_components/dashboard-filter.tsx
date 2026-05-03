"use client"

import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type PeriodType = "filter6Months" | "filterThisYear" | "filter12Months"

export default function DashboardFilter() {
    const t = useTranslations("Dashboard");
    const tClaimType = useTranslations("Assessments");
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
            last6Months.setMonth(time.getMonth() - 5);
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

    return (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center rounded-lg border bg-muted/50 p-1 gap-0.5">
                {periodFilters.map((filter) => (
                    <button
                        key={filter.key}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all text-nowrap",
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
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={tClaimType("filter.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">{tClaimType("claimType.ALL") || "Tất cả"}</SelectItem>
                  <SelectItem value="MEDICAL">{tClaimType("claimType.MEDICAL")}</SelectItem>
                  <SelectItem value="ACCIDENT">{tClaimType("claimType.ACCIDENT")}</SelectItem>
                  <SelectItem value="PROPERTY">{tClaimType("claimType.PROPERTY")}</SelectItem>
                  <SelectItem value="DEATH">{tClaimType("claimType.DEATH")}</SelectItem>
                  <SelectItem value="DISABILITY">{tClaimType("claimType.DISABILITY")}</SelectItem>
                </SelectContent>
              </Select>
            <Button variant="outline" size="sm" className="gap-2 h-9">
                <Download className="h-3.5 w-3.5" />
                {t("exportReport")}
            </Button>
        </div>
    )
}