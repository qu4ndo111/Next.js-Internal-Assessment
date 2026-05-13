import { getAssessmentById } from "@/src/services/assessment";
import AssessmentDetailClient from "./_components/assessment-detail-client";
import { ServerErrorState } from "@/src/components/shared/server-error-state";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  let assessment = null;

  try {
    assessment = await getAssessmentById(id);
  } catch (error) {
    console.error("Failed to load assessment data", error);
  }

  if (!assessment) {
    return (
      <div className="p-6">
        <ServerErrorState />
      </div>
    );
  }

  return (
    <>
      <AssessmentDetailClient data={assessment!} />
    </>
  );
}
