import { getAssessments } from "@/src/services/assessment";
import { columns } from "./columns";
import { DataTable } from "@/src/components/ui/data-table";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function AssessmentTableContainer({ searchParams }: PageProps) {
    const params = await searchParams;

    const data = await getAssessments({
        status: params.status as string,
        type: params.type as string,
        search: params.q as string,
    });

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <DataTable columns={columns} data={data} />
        </div>
    )
}