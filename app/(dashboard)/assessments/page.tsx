import { Search, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { DataTable } from "@/src/components/ui/data-table";
import { columns } from "./columns";
import { getAssessments } from "@/src/services/assessment";
import AssessmentFilter from "./_components/assessment-filter";
import { getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AssessmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const t = await getTranslations("Assessments");

  // Gọi API thông qua Service (Server-side fetching)
  const data = await getAssessments({
    status: params.status as string,
    type: params.type as string,
    search: params.q as string,
  });

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
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="pl-10 bg-background border-muted-foreground/20 focus-visible:ring-primary/30"
              defaultValue={params.q as string}
            />
          </div>
          <AssessmentFilter searchParams={params} />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
