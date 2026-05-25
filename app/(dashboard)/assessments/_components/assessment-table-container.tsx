import { getAssessments } from "@/src/services/assessment";
import AssessmentTableClient from "./assessment-table-client";
import { ServerErrorState } from "@/src/components/shared/client-error-state";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function AssessmentTableContainer({ searchParams }: PageProps) {
    const params = await searchParams;
    const pageSizeList = [10, 20, 30, 50]
    const rawPageIndex = Math.abs(Number(params.page || 1))
    const rawPageSize = Math.abs(Number(params.pageSize || 10))
    const validPageSize = pageSizeList.includes(rawPageSize) ? rawPageSize : 10;

    let data = null

    if (!params.page || !params.pageSize) {
        const newParams = buildRedirectParams(params, {
            page: "1",
            pageSize: "10",
        });
        redirect(`/assessments?${newParams.toString()}`);
    }

    try {
        data = await getAssessments({
            status: params.status as string,
            type: params.type as string,
            search: params.q as string,
            from: params.from as string,
            to: params.to as string,
            assignedTo: params.assignedTo as string,
            page: Math.abs(Number(params.page || 1)),
            pageSize: Math.abs(Number(params.pageSize || 10)),
        });

    } catch {

    }

    if (data) {
        const totalPage = Math.ceil(data.totalCount / validPageSize);
        const validPageIndex = rawPageIndex <= totalPage ? rawPageIndex : Math.max(1, totalPage);
        if (validPageIndex !== rawPageIndex || validPageSize !== rawPageSize) {
            const newParams = buildRedirectParams(params, {
                page: validPageIndex.toString(),
                pageSize: validPageSize.toString(),
            });
            redirect(`/assessments?${newParams.toString()}`);
        }
    }

    function buildRedirectParams(
        params: Record<string, string | string[] | undefined>,
        overrides: Record<string, string>
    ): URLSearchParams {
        const skip = new Set(Object.keys(overrides));
        const result = new URLSearchParams(
            Object.fromEntries(
                Object.entries(params)
                    .filter(([key, v]) => v && !skip.has(key))
                    .map(([k, v]) => [k, v!.toString()])
            )
        );
        Object.entries(overrides).forEach(([k, v]) => result.set(k, v));
        return result;
    }

    return (
        <>
            {data ? <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <AssessmentTableClient initialData={data?.data} totalCount={data?.totalCount} pageIndex={rawPageIndex!} pageSize={rawPageSize!} />
            </div> : <ServerErrorState className="w-full" />}
        </>
    )
}