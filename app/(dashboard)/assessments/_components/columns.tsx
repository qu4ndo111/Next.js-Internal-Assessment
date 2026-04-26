"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Assessment } from "@/src/types/assessment"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: "id",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("id")}</>
    },
    cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("id")}</span>
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
      const t = useTranslations("Assessments.claimType")
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
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <>{t("priority")}</>
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
    accessorKey: "claimedAmount",
    header: function Header() {
      const t = useTranslations("Assessments.columns")
      return <div className="text-right">{t("claimedAmount")}</div>
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
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
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

function AssessmentActions({ assessment }: { assessment: Assessment }) {
  const tActions = useTranslations("Assessments.actions")
  const tDetails = useTranslations("Assessments.details")
  const tClaimType = useTranslations("Assessments.claimType")
  const tPriority = useTranslations("Assessments.priority")

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewDetails = () => {
    setIsDialogOpen(true)
  }

  const handleStartAssessment = () => {
    setIsDialogOpen(false)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
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
          <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            {tActions("viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.success(tActions('quickApprove'))} className="text-green-600 cursor-pointer">
            <CheckCircle className="mr-2 h-4 w-4" />
            {tActions("quickApprove")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.success(tActions('requestInfo'))} className="text-purple-600 cursor-pointer">
            <Clock className="mr-2 h-4 w-4" />
            {tActions("requestInfo")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast.error(tActions('reject'))} className="text-red-600 cursor-pointer">
            <XCircle className="mr-2 h-4 w-4" />
            {tActions("reject")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tDetails("title")}</DialogTitle>
          <DialogDescription>
            {tDetails("id")} <span className="font-mono text-primary font-bold">{assessment.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("customer")}</p>
            <p className="text-sm font-semibold">{assessment.insuredName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("contractNo")}</p>
            <p className="text-sm font-mono">{assessment.contractNo}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("claimType")}</p>
            <p className="text-sm">{tClaimType(assessment.claimType)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("priority")}</p>
            <p className="text-sm">{tPriority(assessment.priority)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("claimedAmount")}</p>
            <p className="text-sm font-semibold text-primary">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(assessment.claimedAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("assessor")}</p>
            <p className="text-sm">{assessment.assignedTo}</p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{tDetails("internalNotes")}</p>
          <p className="text-sm italic text-muted-foreground">
            {assessment.notes || tDetails("noNotes")}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleCloseDialog} variant="outline">{tDetails("close")}</Button>
          <Button onClick={handleStartAssessment}>{tDetails("startAssessment")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
