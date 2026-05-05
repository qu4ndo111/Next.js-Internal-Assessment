import { getAssessmentById } from "@/src/services/assessment";
import AssessmentDetailClient from "./_components/assessment-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  const assessment = await getAssessmentById(id);

  return (
    <>
      <AssessmentDetailClient data={assessment!}/>
    </>
  );
}
