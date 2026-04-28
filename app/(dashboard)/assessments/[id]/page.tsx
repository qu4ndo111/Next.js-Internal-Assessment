import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { ArrowLeft, CheckCircle, Clock, FileText, User, FileDigit, ShieldAlert, DollarSign, XCircle, Download } from "lucide-react";

import { FAKE_ASSESSMENTS } from "@/src/data/assessments";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import AssessmentActionForm from "./_components/assessment-action-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const t = await getTranslations("Assessments");
  const tDetails = await getTranslations("Assessments.details");
  const { id } = await params;

  const assessment = FAKE_ASSESSMENTS.find((item) => item.id === id);

  if (!assessment) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/assessments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{id}</h1>
              <div className="flex items-center gap-2 border rounded-2xl px-2 py-1">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  assessment.status === "APPROVED" && "bg-green-500",
                  assessment.status === "PENDING" && "bg-yellow-500",
                  assessment.status === "REJECTED" && "bg-red-500",
                  assessment.status === "IN_REVIEW" && "bg-blue-500",
                  assessment.status === "ADDITIONAL_INFO_REQUESTED" && "bg-purple-500",
                  assessment.status === "PARTIALLY_APPROVED" && "bg-emerald-400",
                )} />
                <span className="text-sm font-medium">{t(`status.${assessment.status}`)}</span>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                assessment.priority === "URGENT" && "bg-red-100 text-red-700 border border-red-200",
                assessment.priority === "HIGH" && "bg-orange-100 text-orange-700 border border-orange-200",
                assessment.priority === "MEDIUM" && "bg-blue-100 text-blue-700 border border-blue-200",
                assessment.priority === "LOW" && "bg-slate-100 text-slate-700 border border-slate-200",
              )}>
                {t(`priority.${assessment.priority}`)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {tDetails("customer")}: {assessment.insuredName} • {tDetails("contractNo")}: {assessment.contractNo}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xs border-border/50">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {tDetails("customer")}
                  </p>
                  <p className="font-semibold">{assessment.insuredName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileDigit className="h-4 w-4" />
                    {tDetails("contractNo")}
                  </p>
                  <p className="font-mono font-semibold">{assessment.contractNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    {tDetails("claimType")}
                  </p>
                  <p className="font-semibold">{t(`claimType.${assessment.claimType}`)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {tDetails("claimedAmount")}
                  </p>
                  <p className="font-semibold text-primary">{formatCurrency(assessment.claimedAmount)}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{tDetails("internalNotes")}</p>
                <div className="bg-muted/30 p-4 rounded-md text-sm border">
                  {assessment.notes || tDetails("noNotes")}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/50">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {assessment.documents && assessment.documents.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {assessment.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors cursor-pointer">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{tDetails("uploadedAt")} {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground">No documents attached.</p>
              )}
            </CardContent>

          </Card>
        </div>

        <div className="space-y-6">
          {["APPROVED", "REJECTED", "PARTIALLY_APPROVED"].includes(assessment.status) ? (
            <Card className={cn(
              "shadow-lg border-2 overflow-hidden",
              assessment.status === "APPROVED" && "border-green-500/20 bg-green-50/30 dark:bg-green-500/5",
              assessment.status === "REJECTED" && "border-red-500/20 bg-red-50/30 dark:bg-red-500/5",
              assessment.status === "PARTIALLY_APPROVED" && "border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Review Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    assessment.status === "APPROVED" && "bg-green-100 text-green-600 dark:bg-green-900/30",
                    assessment.status === "REJECTED" && "bg-red-100 text-red-600 dark:bg-red-900/30",
                    assessment.status === "PARTIALLY_APPROVED" && "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                  )}>
                    {assessment.status === "APPROVED" && <CheckCircle className="h-6 w-6" />}
                    {assessment.status === "REJECTED" && <XCircle className="h-6 w-6" />}
                    {assessment.status === "PARTIALLY_APPROVED" && <Clock className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {t(`status.${assessment.status}`)}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Processed by {assessment.assignedTo}
                    </p>
                  </div>
                </div>

                {assessment.status === "APPROVED" && assessment.assessedAmount !== null && (
                  <div className="bg-background/50 p-3 rounded-lg border border-green-500/10">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Approved Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(assessment.assessedAmount)}</p>
                  </div>
                )}

                {assessment.rejectionReason && assessment.status === "REJECTED" && (
                  <div className="bg-background/50 p-3 rounded-lg border border-red-500/10">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Rejection Reason</p>
                    <p className="text-sm text-red-600 font-medium">{assessment.rejectionReason}</p>
                  </div>
                )}

                {assessment.status === "APPROVED" && assessment.reviewNote && (
                  <div className="bg-background/50 p-3 rounded-lg border border-green-500/10">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Review Note</p>
                    <p className="text-sm text-green-600 font-medium">{assessment.reviewNote}</p>
                  </div>
                )}

                <Separator className="opacity-50" />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Completion Date</span>
                  <span className="font-medium">
                    {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <AssessmentActionForm {...assessment} />
          )}

          <Card className="shadow-xs border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Processing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{tDetails("assessor")}</span>
                <span className="font-medium">{assessment.assignedTo}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Submitted At</span>
                <span className="font-medium">
                  {new Date(assessment.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium text-orange-600">
                  {new Date(assessment.deadline).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
