import { getAssessments } from "@/src/services/assessment";
import AssessmentTableClient from "./assessment-table-client";
import { ServerErrorState } from "@/src/components/shared/server-error-state";
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
            const newSearchParams = new URLSearchParams();
            if (params.status) newSearchParams.set("status", params.status.toString());
            if (params.type) newSearchParams.set("type", params.type.toString());
            if (params.q) newSearchParams.set("q", params.q.toString());
            if (params.from) newSearchParams.set("from", params.from.toString());
            if (params.to) newSearchParams.set("to", params.to.toString());
            if (params.assignedTo) newSearchParams.set("assignedTo", params.assignedTo.toString());
            newSearchParams.set("page", validPageIndex.toString());
            newSearchParams.set("pageSize", validPageSize.toString());
            redirect(`/assessments?${newSearchParams.toString()}`);
        }
    }

    return (
        <>
            {data ? <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <AssessmentTableClient initialData={data?.data} totalCount={data?.totalCount} pageIndex={rawPageIndex!} pageSize={rawPageSize!} />
            </div> : <ServerErrorState className="w-full" />}
        </>
    )
}