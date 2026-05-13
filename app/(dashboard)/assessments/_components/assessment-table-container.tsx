import { getAssessments } from "@/src/services/assessment";
import AssessmentTableClient from "./assessment-table-client";
import { ServerErrorState } from "@/src/components/shared/server-error-state";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function AssessmentTableContainer({ searchParams }: PageProps) {
    const params = await searchParams;

    let data = null

    try {
        data = await getAssessments({
            status: params.status as string,
            type: params.type as string,
            search: params.q as string,
            from: params.from as string,
            to: params.to as string,
            assignedTo: params.assignedTo as string,
        });
    } catch {
        
    }

    return (
        <>
            {data ? <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <AssessmentTableClient initialData={data!}/>
            </div> : <ServerErrorState className="w-full" />}
        </>
    )
}