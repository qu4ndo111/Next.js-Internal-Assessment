"use client"
import { useDispatch } from "react-redux";
import { ColumnDef } from "@tanstack/react-table"
import { Assessment, AssessmentStatus } from "@/src/types/assessment"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { vi, enUS } from "date-fns/locale";
import { format } from "date-fns";

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: "id",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("id")}</>
    },
    cell: ({ row }) => <Link href={`/assessments/${row.getValue("id")}`} className="font-mono underline font-medium hover:text-blue-500">{row.getValue("id")}</Link>
  },
  {
    accessorKey: "insuredName",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("insuredName")}</>
    },
  },
  {
    accessorKey: "claimType",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("claimType")}</>
    },
    cell: function Cell({ row }) {
      const t = useTranslations("ClaimType")
      const type = row.getValue("claimType") as string
      return (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
          {t(type)}
        </span>
      )
    }
  },
  {
    accessorKey: "priority",
    header: function Header({ column }) {
      const t = useTranslations("Assessments.columns")
      return (
        <div className="flex items-center gap-1">
          {t("priority")}
          {column.getCanSort() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )
    },
    cell: function Cell({ row }) {
      const t = useTranslations("Assessments.priority")
      const priority = row.getValue("priority") as string
      return (
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
          priority === "URGENT" && "bg-red-100 text-red-700 border border-red-200",
          priority === "HIGH" && "bg-orange-100 text-orange-700 border border-orange-200",
          priority === "MEDIUM" && "bg-blue-100 text-blue-700 border border-blue-200",
          priority === "LOW" && "bg-slate-100 text-slate-700 border border-slate-200",
        )}>
          {t(priority)}
        </span>
      )
    }
  },
  {
    accessorKey: "status",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("status")}</>
    },
    cell: function Cell({ row }) {
      const t = useTranslations("Assessments.status")
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            status === "APPROVED" && "bg-green-500",
            status === "PENDING" && "bg-yellow-500",
            status === "REJECTED" && "bg-red-500",
            status === "IN_REVIEW" && "bg-blue-500",
            status === "ADDITIONAL_INFO_REQUESTED" && "bg-purple-500",
            status === "PARTIALLY_APPROVED" && "bg-emerald-400",
          )} />
          <span className="text-sm font-medium">{t(status)}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "assignedTo",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("assignedTo")}</>
    },
    cell: function Cell({ row }) {
      const assignedTo = row.getValue("assignedTo") as string
      return (
        <span className="text-sm font-medium">{assignedTo}</span>
      )
    }
  },
  {
    accessorKey: "submittedAt",
    header: function Header({ column }) {
      const t = useTranslations("Assessments.columns")
      return (
        <div className="flex items-center gap-1">
          {t("submittedAt")}
          {column.getCanSort() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )
    },
    cell: function Cell({ row }) {
      const submittedAt = row.getValue("submittedAt") as string
      const locale = useLocale();
      const dateLocale = locale === "vi" ? vi : enUS;

      return (
        <span className="text-sm font-medium">{format(new Date(submittedAt), locale === "vi" ? "dd/MM/yyyy" : "PPP", { locale: dateLocale })}</span>
      )
    }
  },
  {
    accessorKey: "claimedAmount",
    header: function Header({ column }) {
      const t = useTranslations("Assessments.columns")
      return (
        <div className="flex items-center justify-end gap-1">
          {t("claimedAmount")}
          {column.getCanSort() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )
    },
    cell: function Cell({ row }) {
      const amount = parseFloat(row.getValue("claimedAmount"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assessment = row.original
      const notAllowed = ["APPROVED", "REJECTED", "PARTIALLY_APPROVED"]

      if (notAllowed.includes(assessment.status)) {
        return <></>
      }

      return (
        <div className="text-right">
          <AssessmentActions assessment={assessment} />
        </div>
      )
    },
  },
]

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, Clock, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Textarea } from "@/src/components/ui/textarea"
import { updateAssessment } from "@/src/services/assessment"
import { updateAssessmentStatus } from "@/src/store/features/assessmentsSlice";

function AssessmentActions({ assessment }: { assessment: Assessment }) {
  const tActions = useTranslations("Assessments.actions")
  const tDetails = useTranslations("Assessments.details")
  const t = useTranslations("Assessments")
  const dispatch = useDispatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSelectedStatus, setCurrentSelectedStatus] = useState<AssessmentStatus>(assessment.status)
  const [message, setMessage] = useState<string>("")
  const [assessmentLoading, setAssessmentLoading] = useState<boolean>(false)

  const handleViewDetails = (currentStatus: AssessmentStatus) => {
    setIsDialogOpen(true)
    setCurrentSelectedStatus(currentStatus)
  }

  const handleStartAssessment = async () => {
    if (!message.trim()) {
      toast.warning(t("toasts.messageRequired"));
      return;
    }
    const previousStatus = assessment.status;
    setAssessmentLoading(true);
    try {
      dispatch(updateAssessmentStatus({
        id: assessment.id,
        status: currentSelectedStatus,
        updateMessage: message
      }))
      setIsDialogOpen(false);

      const res = await updateAssessment(assessment.id, currentSelectedStatus, message);
      if (res.success) {
        toast.success(t("toasts.updateSuccess", { id: assessment.id }));
      } else {
        throw new Error("Update failed")
      }
    } catch {
      dispatch(updateAssessmentStatus({
        id: assessment.id,
        status: previousStatus,
        updateMessage: ""
      }))
      toast.error(t("toasts.updateError", { id: assessment.id }));
    } finally {
      setAssessmentLoading(false);
      setCurrentSelectedStatus(assessment.status)
      setMessage("")
    }
  }

  const handleCloseDialog = (open: boolean) => {
    if (assessmentLoading) return;
    setIsDialogOpen(open)
    if (!open) {
      setMessage("")
      setCurrentSelectedStatus(assessment.status)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>{tActions("title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            assessment.status !== "ADDITIONAL_INFO_REQUESTED" ? (
              <>
                <DropdownMenuItem onClick={() => handleViewDetails('APPROVED')} className="text-green-600 cursor-pointer">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {tActions("quickApprove")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewDetails('PENDING')} className="text-purple-600 cursor-pointer">
                  <Clock className="mr-2 h-4 w-4" />
                  {tActions("requestInfo")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : null
          }
          <DropdownMenuItem onClick={() => handleViewDetails("REJECTED")} className="text-red-600 cursor-pointer">
            <XCircle className="mr-2 h-4 w-4" />
            {tActions("reject")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent 
        className="max-w-2xl" 
        showCloseButton={!assessmentLoading}
        onPointerDownOutside={(e) => { if (assessmentLoading) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (assessmentLoading) e.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle>{tDetails("title")}</DialogTitle>
          <DialogDescription>
            {tDetails("id")} <span className="font-mono text-primary font-bold">{assessment.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div >
          <Textarea id="reviewNote" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full border rounded-md p-2 text-sm" placeholder={t("quickReview.reviewNotePlaceholder")} />
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("internalNotes")}</p>
          <p className="text-sm italic text-muted-foreground">
            {assessment.notes || tDetails("noNotes")}
          </p>
        </div>

        <DialogFooter>
          <Button disabled={assessmentLoading} onClick={() => handleCloseDialog(false)} variant="outline">{tDetails("close")}</Button>
          <Button onClick={handleStartAssessment} disabled={assessmentLoading}>
            {assessmentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tDetails("startAssessment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
