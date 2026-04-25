import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AssessmentFilter from "./_components/assessment-filter";
import { getTranslations } from "next-intl/server";
import AssessmentTableContainer from "./_components/assessment-table-container";
import { Suspense } from "react";
import TableSkeleton from "@/src/components/shared/skeletons/TableSkeleton";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AssessmentsPage({ searchParams }: PageProps) {
  const t = await getTranslations("Assessments");
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Plus className="h-4 w-4" />
          {t("createNew")}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <AssessmentFilter />
      </div>
      <Suspense key={`${params.q}-${params.status}-${params.type}`} fallback={<TableSkeleton />}>
        <AssessmentTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
