import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ReportFilter from "./_components/report-filter";
import { DataTable } from "@/src/components/ui/data-table";
import { assessorColumns, monthlyColumns } from "./_components/columns";
import { getAssessorReportData, getMonthlyReportData } from "@/src/services/report";
import { redirect } from "next/navigation";
import ReportActions from "./_components/report-actions";
import { Suspense } from "react";
import TableSkeleton from "@/src/components/shared/skeletons/TableSkeleton";
import { ServerErrorState } from "@/src/components/shared/client-error-state";

interface ReportsPageProps {
    searchParams: Promise<{
        tab: string;
        from?: string;
        to?: string;
        type?: string;
    }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    // redirect("/dashboard");
    const t = await getTranslations("Reports");
    const params = await searchParams;
    const activeTab: string = params.tab;
    const suspenseKey = `${activeTab}-${params.from}-${params.to}-${params.type}`;

    if (!activeTab) redirect("reports?tab=monthly");

    const buildNavUrl = (tab: string) => {
        const newParams = new URLSearchParams();
        newParams.set("tab", tab);
        if (params.from) newParams.set("from", params.from);
        if (params.to) newParams.set("to", params.to);
        if (params.type) newParams.set("type", params.type);
        return `reports?${newParams.toString()}`;
    }

    return (
        <div className="flex flex-col gap-6 md:p-6">
            <div className="flex items-start justify-between gap-2 flex-col sm:items-center sm:flex-row ">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t("description")}
                    </p>
                </div>
                <div>
                    <div className="flex border-b">
                        <Link
                            href={buildNavUrl('monthly')}
                            className={`px-4 py-2 font-medium ${activeTab === 'monthly' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            {t("tabs.monthly")}
                        </Link>
                        <Link
                            href={buildNavUrl('assessor')}
                            className={`px-4 py-2 font-medium ${activeTab === 'assessor' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            {t("tabs.assessor")}
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <ReportFilter />
            </div>
            <Suspense fallback={<TableSkeleton />} key={suspenseKey}>
                {activeTab === 'monthly' ? (
                    <MonthlyTableContainer params={params} />
                ) : (
                    <AssessorTableContainer params={params} />
                )}
            </Suspense>
        </div>
    )
}

async function MonthlyTableContainer({ params }: { params: any }) {
    let monthlyReportData;
    try {
        monthlyReportData = await getMonthlyReportData(params);
    } catch (error) {
        return (
            <ServerErrorState className="w-full" />
        )
    }

    if (!monthlyReportData) return (
        <ServerErrorState className="w-full" />
    )

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-end">
                <ReportActions tab="monthly" monthlyData={monthlyReportData} />
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden">
                <DataTable columns={monthlyColumns} data={monthlyReportData} />
            </div>
        </div>
    );
}

async function AssessorTableContainer({ params }: { params: any }) {
    let assessorReportData;
    try {
        assessorReportData = await getAssessorReportData(params);
    } catch (error) {
        return (
            <ServerErrorState className="w-full" />
        )
    }

    if (!assessorReportData) return (
        <ServerErrorState className="w-full" />
    )

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-end">
                <ReportActions tab="assessor" assessorData={assessorReportData} />
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden">
                <DataTable columns={assessorColumns} data={assessorReportData} />
            </div>
        </div>
    );
}
