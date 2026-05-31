"use client"

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarIcon, Search, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export default function AssessmentFilter() {
  const t = useTranslations("Assessments");
  const tClaimType = useTranslations("ClaimType");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (searchValue === currentQ) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, pathname, router, searchParams]);

  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get("from") ? new Date(searchParams.get("from") as string) : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to") as string) : undefined,
  });
  const [assignedTo, setAssignedTo] = useState(searchParams.get("assignedTo") || "all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    if (type && type !== "all") params.set("type", type);
    else params.delete("type");

    if (dateRange?.from) params.set("from", dateRange.from.toISOString());
    else params.delete("from");

    if (dateRange?.to) params.set("to", dateRange.to.toISOString());
    else params.delete("to");

    if (assignedTo && assignedTo !== "all") params.set("assignedTo", assignedTo);
    else params.delete("assignedTo");

    router.push(`${pathname}?${params.toString()}`);
    setIsDialogOpen(false);
  };

  const handleClearFilter = () => {
    setStatus("all");
    setType("all");
    setDateRange(undefined);
    setAssignedTo("all");
  };

  return (
    <div className="flex flex-1 items-center flex-wrap gap-2">
      <div className="relative w-full sm:max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="pl-10 bg-background border-muted-foreground/20 focus-visible:ring-primary/30"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 border-dashed sm:w-auto w-full">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filter.advanced")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t("filter.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold mb-2 block">{t("filter.statusLabel")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("filter.statusPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("status.ALL") || "Tất cả"}</SelectItem>
                  <SelectItem value="PENDING">{t("status.PENDING")}</SelectItem>
                  <SelectItem value="IN_REVIEW">{t("status.IN_REVIEW")}</SelectItem>
                  <SelectItem value="APPROVED">{t("status.APPROVED")}</SelectItem>
                  <SelectItem value="REJECTED">{t("status.REJECTED")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold mb-2 block">{t("filter.typeLabel")}</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("filter.typePlaceholder")} />
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
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold mb-2 block">{t("filter.dateRangeLabel")}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold mb-2 block">{t("filter.assignedToLabel")}</label>
              <Select onValueChange={setAssignedTo} value={assignedTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("filter.assignedToPlaceholder")} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">{tClaimType("ALL")}</SelectItem>
                  <SelectItem value="Trần Thị B">Trần Thị B</SelectItem>
                  <SelectItem value="Phạm Văn D">Phạm Văn D</SelectItem>
                  <SelectItem value="Nguyễn Văn F">Nguyễn Văn F</SelectItem>
                  <SelectItem value="Lê Hoàng G">Lê Hoàng G</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleClearFilter}>{t("filter.clear")}</Button>
              <Button onClick={handleApplyFilter}>{t("filter.apply")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
