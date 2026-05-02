import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getTranslations } from "next-intl/server";
import VolumeChart from "./_components/volume-chart";
import TypeDistributionChart from "./_components/type-distribution-chart";
import ProcessingTimeChart from "./_components/processing-time-chart";
import ApprovalRateChart from "./_components/approval-rate-chart";
import { Button } from "@/src/components/ui/button";
import { Download, TrendingUp, TrendingDown, Minus, FileText, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAKE_ASSESSMENTS } from "@/src/data/assessments";
import { getApprovalRate, getDashboardKPIs, getProcessingTime, getTypeDistribution, getVolumeByMonth } from "@/src/services/dashboard";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");

  const kpiData = await getDashboardKPIs(FAKE_ASSESSMENTS);
  const volumeData = await getVolumeByMonth(FAKE_ASSESSMENTS);
  const typeDistributionData = await getTypeDistribution(FAKE_ASSESSMENTS);
  const processingTimeData = await getProcessingTime(FAKE_ASSESSMENTS);
  const approvalRateData = await getApprovalRate(FAKE_ASSESSMENTS);

  const kpis = [
    {
      label: t("totalAssessments"),
      value: kpiData.totalAssessments,
      trend: "+12.5%",
      trendUp: true as boolean | null,
      icon: FileText,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: t("inProgress"),
      value: kpiData.inProgress,
      trend: "+4.1%",
      trendUp: true as boolean | null,
      icon: Clock,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      label: t("approvalRate"),
      value: kpiData.approvalRate,
      trend: "-2.3%",
      trendUp: false as boolean | null,
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      label: t("avgProcessingTime"),
      value: kpiData.avgProcessingTime + " " + t("days"),
      trend: "0%",
      trendUp: null as boolean | null,
      icon: BarChart3,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
  ];

  const periodFilters = [
    { key: "filter6Months", label: t("filter6Months") },
    { key: "filterThisYear", label: t("filterThisYear") },
    { key: "filter12Months", label: t("filter12Months") }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("kpiOverview")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("kpiOverviewDesc")}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border bg-muted/50 p-1 gap-0.5">
            {periodFilters.map((filter, i) => (
              <button
                key={filter.key}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  i === 0
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Download className="h-3.5 w-3.5" />
            {t("exportReport")}
          </Button>
        </div>
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
