"use client"

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function AssessmentFilter() {
  const t = useTranslations("Assessments");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    if (type && type !== "all") params.set("type", type);
    else params.delete("type");

    router.push(`${pathname}?${params.toString()}`);
    setIsDialogOpen(false);
  };

  const handleClearFilter = () => {
    setStatus("all");
    setType("all");
  };

  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative w-full max-w-sm">
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
          <Button variant="outline" className="gap-2 border-dashed">
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
                  <SelectItem value="all">{t("claimType.ALL") || "Tất cả"}</SelectItem>
                  <SelectItem value="MEDICAL">{t("claimType.MEDICAL")}</SelectItem>
                  <SelectItem value="ACCIDENT">{t("claimType.ACCIDENT")}</SelectItem>
                  <SelectItem value="PROPERTY">{t("claimType.PROPERTY")}</SelectItem>
                  <SelectItem value="DEATH">{t("claimType.DEATH")}</SelectItem>
                  <SelectItem value="DISABILITY">{t("claimType.DISABILITY")}</SelectItem>
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
