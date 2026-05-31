"use client"

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Button } from "@/src/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export default function ReportFilter() {
    const t = useTranslations("Reports");
    const tClaimType = useTranslations("ClaimType");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const dateLocale = locale === "vi" ? vi : enUS;

    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    const urlType = searchParams.get("type") || "all";

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (urlFrom && urlTo) {
            return { from: new Date(urlFrom), to: new Date(urlTo) };
        }
        return undefined;
    });
    const [selectedType, setSelectedType] = useState<string>(urlType);

    useEffect(() => {
        setSelectedType(urlType);
    }, [urlType]);

    useEffect(() => {
        if (urlFrom && urlTo) {
            setDateRange({ from: new Date(urlFrom), to: new Date(urlTo) });
        } else {
            setDateRange(undefined);
        }
    }, [urlFrom, urlTo]);

    const handleSelectType = (val: string) => {
        setSelectedType(val);
        const params = new URLSearchParams(searchParams.toString());
        if (val && val !== "all") {
            params.set("type", val);
        } else {
            params.delete("type");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSelectDateRange = (range: DateRange | undefined) => {
        setDateRange(range);
        
        if (!range) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("from");
            params.delete("to");
            router.push(`${pathname}?${params.toString()}`);
            return;
        }

        if (range.from && range.to) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("from", format(range.from, "yyyy-MM-dd"));
            params.set("to", format(range.to, "yyyy-MM-dd"));
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const handleClearFilters = () => {
        setDateRange(undefined);
        setSelectedType("all");
        
        const params = new URLSearchParams(searchParams.toString());
        params.delete("from");
        params.delete("to");
        params.delete("type");
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasActiveFilters = urlFrom || urlTo || (urlType && urlType !== "all");

    return (
        <div className="flex flex-wrap items-center gap-3 w-full justify-between sm:justify-start">
            <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-none">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal bg-background w-full sm:w-[260px] border-muted-foreground/20",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, locale === "vi" ? "dd/MM/yyyy" : "LLL dd, y", { locale: dateLocale })} -{" "}
                                        {format(dateRange.to, locale === "vi" ? "dd/MM/yyyy" : "LLL dd, y", { locale: dateLocale })}
                                    </>
                                ) : (
                                    format(dateRange.from, locale === "vi" ? "dd/MM/yyyy" : "LLL dd, y", { locale: dateLocale })
                                )
                            ) : (
                                <span>{t("filter.selectDateRange")}</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={handleSelectDateRange}
                            numberOfMonths={2}
                            locale={dateLocale}
                        />
                    </PopoverContent>
                </Popover>

                <Select value={selectedType} onValueChange={handleSelectType}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-muted-foreground/20">
                        <SelectValue placeholder={t("filter.claimTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="all">{tClaimType("ALL")}</SelectItem>
                        <SelectItem value="MEDICAL">{tClaimType("MEDICAL")}</SelectItem>
                        <SelectItem value="ACCIDENT">{tClaimType("ACCIDENT")}</SelectItem>
                        <SelectItem value="PROPERTY">{tClaimType("PROPERTY")}</SelectItem>
                        <SelectItem value="DEATH">{tClaimType("DEATH")}</SelectItem>
                        <SelectItem value="DISABILITY">{tClaimType("DISABILITY")}</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/80 gap-1.5 h-9 px-3 text-sm shrink-0"
                    >
                        <X className="h-4 w-4" />
                        {t("filter.clear")}
                    </Button>
                )}
            </div>
        </div>
    )
}