import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { getTranslations } from "next-intl/server";
import AssessmentForm from "./_components/assessment-form";


export default async function CreateAssessmentPage() {
    const t = await getTranslations("Assessments");

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/assessments">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("create.title")}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t("create.description")}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <AssessmentForm />
            </div>
        </div>
    );
}