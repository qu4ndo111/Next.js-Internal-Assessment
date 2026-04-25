"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface AssessmentFilterProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function AssessmentFilter({ searchParams }: AssessmentFilterProps) {
    const params = searchParams;
    const t = useTranslations("Assessments");

    return (
         <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-dashed">
                <SlidersHorizontal className="h-4 w-4" />
                {t("filter.advanced")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("filter.title")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold mb-2 block" htmlFor="status">{t("filter.statusLabel")}</label>
                  <Select defaultValue={params.status as string}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder={t("filter.statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="PENDING">{t("status.PENDING")}</SelectItem>
                      <SelectItem value="IN_REVIEW">{t("status.IN_REVIEW")}</SelectItem>
                      <SelectItem value="APPROVED">{t("status.APPROVED")}</SelectItem>
                      <SelectItem value="REJECTED">{t("status.REJECTED")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold mb-2 block">{t("filter.typeLabel")}</label>
                  <Select defaultValue={params.type as string}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("filter.typePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="MEDICAL">{t("claimType.MEDICAL")}</SelectItem>
                      <SelectItem value="ACCIDENT">{t("claimType.ACCIDENT")}</SelectItem>
                      <SelectItem value="PROPERTY">{t("claimType.PROPERTY")}</SelectItem>
                      <SelectItem value="DEATH">{t("claimType.DEATH")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 justify-end pt-4">
                  <Button variant="outline">{t("filter.clear")}</Button>
                  <Button>{t("filter.apply")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
    )
}