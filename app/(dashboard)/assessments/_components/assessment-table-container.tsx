import { getAssessments } from "@/src/services/assessment";
import AssessmentTableClient from "./assessment-table-client";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function AssessmentTableContainer({ searchParams }: PageProps) {
    const params = await searchParams;

    const data = await getAssessments({
        status: params.status as string,
        type: params.type as string,
        search: params.q as string,
        from: params.from as string,
        to: params.to as string,
        assignedTo: params.assignedTo as string,
    });

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <AssessmentTableClient initialData={data} />
        </div>
    )
}