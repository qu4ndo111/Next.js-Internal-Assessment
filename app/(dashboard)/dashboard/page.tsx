import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getTranslations } from "next-intl/server";
import VolumeChart from "./_components/volume-chart";
import TypeDistributionChart from "./_components/type-distribution-chart";
import ProcessingTimeChart from "./_components/processing-time-chart";
import ApprovalRateChart from "./_components/approval-rate-chart";
import { TrendingUp, TrendingDown, Minus, FileText, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAKE_ASSESSMENTS } from "@/src/data/assessments";
import { getApprovalRate, getDashboardKPIs, getProcessingTime, getTypeDistribution, getVolumeByMonth } from "@/src/services/dashboard";
import DashboardFilter from "./_components/dashboard-filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const t = await getTranslations("Dashboard");
  const params = await searchParams;

  const from = params.from as string;
  const to = params.to as string;
  const period = params.period as string || "filter6Months";
  const type = params.type as string || "all";

  if (!from || !to) {
    const time = new Date();
    const defaultTo = time.toISOString().split('T')[0];
    
    const last6Months = new Date();
    last6Months.setMonth(time.getMonth() - 5);
    const defaultFrom = last6Months.toISOString().split('T')[0];
    
    redirect(`/dashboard?period=${period}&from=${defaultFrom}&to=${defaultTo}${type !== 'all' ? `&type=${type}` : ''}`);
  }

  const dateFilteredAssessments = FAKE_ASSESSMENTS.filter(a => {
    const submitDate = new Date(a.submittedAt).toISOString().split('T')[0];
    return submitDate >= from && submitDate <= to;
  });

  const fullyFilteredAssessments = dateFilteredAssessments.filter(a => {
    if (type !== "all") {
        return a.claimType === type;
    }
    return true;
  });


  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffInMs = toDate.getTime() - fromDate.getTime();
  
  const previousToDate = new Date(fromDate.getTime() - (24 * 60 * 60 * 1000));
  const previousFromDate = new Date(previousToDate.getTime() - diffInMs);
  
  const prevFromStr = previousFromDate.toISOString().split('T')[0];
  const prevToStr = previousToDate.toISOString().split('T')[0];

  const previousFilteredAssessments = FAKE_ASSESSMENTS.filter(a => {
    const submitDate = new Date(a.submittedAt).toISOString().split('T')[0];
    return submitDate >= prevFromStr && submitDate <= prevToStr;
  });

  const kpiData = await getDashboardKPIs(fullyFilteredAssessments, previousFilteredAssessments);
  const volumeData = await getVolumeByMonth(fullyFilteredAssessments);
  const typeDistributionData = await getTypeDistribution(dateFilteredAssessments);
  const processingTimeData = await getProcessingTime(fullyFilteredAssessments);
  const approvalRateData = await getApprovalRate(fullyFilteredAssessments);

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
    <div className="flex flex-col gap-6 p-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("kpiOverview")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("kpiOverviewDesc")}</p>
        </div>

        <Suspense fallback={<div className="h-9 w-[300px] animate-pulse bg-muted/50 rounded-lg" />}>
          <DashboardFilter />
        </Suspense>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <div className={cn("h-9 w-9 flex items-center justify-center rounded-lg", kpi.iconBg)}>
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
                  <p className={cn(
                    "text-xs font-medium",
                    kpi.trendUp === null
                      ? "text-muted-foreground"
                      : kpi.trendUp ? "text-green-600" : "text-red-600"
                  )}>
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

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>{t("volumeByMonth")}</CardTitle>
            <CardDescription>{t("volumeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pl-2">
            <VolumeChart volumeData={volumeData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>{t("distributionByType")}</CardTitle>
            <CardDescription>{t("distributionDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <TypeDistributionChart typeDistributionData={typeDistributionData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>{t("processingTimeTrend")}</CardTitle>
            <CardDescription>{t("processingTimeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pl-2">
            <ProcessingTimeChart processingTimeData={processingTimeData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>{t("approvalRateTitle")}</CardTitle>
            <CardDescription>{t("approvalRateDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ApprovalRateChart approvalRateData={approvalRateData} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
