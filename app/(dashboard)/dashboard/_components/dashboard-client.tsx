"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import VolumeChart from "@/app/(dashboard)/dashboard/_components/volume-chart";
import TypeDistributionChart from "@/app/(dashboard)/dashboard/_components/type-distribution-chart";
import ProcessingTimeChart from "@/app/(dashboard)/dashboard/_components/processing-time-chart";
import ApprovalRateChart from "@/app/(dashboard)/dashboard/_components/approval-rate-chart";
import { TrendingUp, TrendingDown, Minus, FileText, Clock, CheckCircle, BarChart3, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardFilter from "@/app/(dashboard)/dashboard/_components/dashboard-filter";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ServerErrorState } from "@/src/components/shared/client-error-state";
import { useGetDashboardDataQuery } from "@/src/store/services/dashboard-api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";

export default function DashboardPage({
  from,
  to,
  period,
  type,
}: {
  from?: string;
  to?: string;
  period: string;
  type: string;
}) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const pathname = usePathname();

  let effectiveFrom = from || "";
  let effectiveTo = to || "";

  if (!from || !to) {
    const time = new Date();
    effectiveTo = time.toISOString().split("T")[0];

    const last6Months = new Date();
    last6Months.setMonth(time.getMonth() - 5);
    effectiveFrom = last6Months.toISOString().split("T")[0];
  }

  useEffect(() => {
    if (!from || !to) {
      router.replace(
        `${pathname}?period=${period}&from=${effectiveFrom}&to=${effectiveTo}${type !== "all" ? `&type=${type}` : ""
        }`
      );
    }
  }, [from, to, period, type, pathname, router, effectiveFrom, effectiveTo]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetDashboardDataQuery(
    {
      from: effectiveFrom,
      to: effectiveTo,
      period,
      type,
    },
    {
      skip: !effectiveFrom || !effectiveTo,
    }
  );

  if (isError) {
    const friendlyMessage = (error as any)?.friendlyMessage || "Đã xảy ra lỗi khi tải số liệu thống kê.";
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[60vh] gap-6 text-center w-full">
        <ServerErrorState
          className="max-w-md w-full"
          description={friendlyMessage}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading || !data) {
    return <DashboardSkeleton title={t("kpiOverview")} description={t("kpiOverviewDesc")} />;
  }
  const { kpiData, volumeData, typeDistributionData, processingTimeData, approvalRateData, fullyFilteredAssessments } = data;

  const kpis = [
    {
      label: t("totalAssessments"),
      value: kpiData.totalAssessments,
      trend: kpiData.trends.total.value,
      trendUp: kpiData.trends.total.isUp,
      icon: FileText,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: t("inProgress"),
      value: kpiData.inProgress,
      trend: kpiData.trends.inProgress.value,
      trendUp: kpiData.trends.inProgress.isUp,
      icon: Clock,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      label: t("approvalRate"),
      value: kpiData.approvalRate,
      trend: kpiData.trends.approvalRate.value,
      trendUp: kpiData.trends.approvalRate.isUp,
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      label: t("avgProcessingTime"),
      value: kpiData.avgProcessingTime + " " + t("days"),
      trend: kpiData.trends.avgProcessingTime.value,
      trendUp: kpiData.trends.avgProcessingTime.isUp,
      icon: BarChart3,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("kpiOverview")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("kpiOverviewDesc")}</p>
          </div>
          {isFetching && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium animate-pulse shrink-0">
              <RotateCw className="h-3 w-3 animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9 border shrink-0 hover:bg-muted transition-all", isFetching && "opacity-50 pointer-events-none")}
            title="Làm mới dữ liệu"
          >
            <RotateCw className={cn("h-4 w-4 text-muted-foreground", isFetching && "animate-spin text-primary")} />
          </Button>
          <DashboardFilter data={fullyFilteredAssessments} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="relative overflow-hidden group hover:shadow-md transition-all border-muted-foreground/15">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <div className={cn("h-9 w-9 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform", kpi.iconBg)}>
                  <Icon className={cn("h-4 w-4", kpi.iconColor)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trendUp === null ? (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  ) : kpi.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      kpi.trendUp === null
                        ? "text-muted-foreground"
                        : kpi.trendUp
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {kpi.trend}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("comparedToLastMonth")}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col border-muted-foreground/15 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{t("volumeByMonth")}</CardTitle>
            <CardDescription className="text-xs">{t("volumeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pl-2 min-w-0">
            <VolumeChart volumeData={volumeData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col border-muted-foreground/15 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{t("distributionByType")}</CardTitle>
            <CardDescription className="text-xs">{t("distributionDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-w-0">
            <TypeDistributionChart typeDistributionData={typeDistributionData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col border-muted-foreground/15 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{t("processingTimeTrend")}</CardTitle>
            <CardDescription className="text-xs">{t("processingTimeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pl-2 min-w-0">
            <ProcessingTimeChart processingTimeData={processingTimeData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col border-muted-foreground/15 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{t("approvalRateTitle")}</CardTitle>
            <CardDescription className="text-xs">{t("approvalRateDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-w-0">
            <ApprovalRateChart approvalRateData={approvalRateData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-[280px] rounded-md" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-muted-foreground/15">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col border-muted-foreground/15 min-w-0 overflow-hidden">
            <CardHeader className="pb-2 space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center">
              <Skeleton className="h-[260px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
