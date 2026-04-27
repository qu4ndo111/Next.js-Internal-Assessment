import { FAKE_ASSESSMENTS } from "../data/assessments";
import { Assessment, CreateAssessmentInput } from "../types/assessment";

export async function getAssessments(filters?: { status?: string; type?: string; search?: string }): Promise<Assessment[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let data = [...FAKE_ASSESSMENTS];

  console.log(FAKE_ASSESSMENTS)

  if (filters?.status) {
    data = data.filter((item) => item.status === filters.status);
  }
  if (filters?.type) {
    data = data.filter((item) => item.claimType === filters.type);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    data = data.filter((item) =>
      item.id.toLowerCase().includes(s) ||
      item.insuredName.toLowerCase().includes(s)
    );
  }

  return data;
}


export async function createAssessment(data: CreateAssessmentInput) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const body: Assessment = {
    id: generateNewAssessmentId(),
    claimId: data.claimId,
    claimType: data.claimType,
    insuredName: data.insuredName,
    contractNo: data.contractNo,
    claimedAmount: data.claimedAmount,
    assessedAmount: null,
    priority: data.priority,
    status: "PENDING",
    assignedTo: data.assignedTo,
    submittedAt: new Date().toISOString(),
    deadline: data.deadline.toISOString(),
    completedAt: null,
    processingDays: null,
    rejectionReason: null,
    documents: data.documents.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })),
    notes: data.notes,
  };

  FAKE_ASSESSMENTS.unshift(body);

  return {
    success: true,
    data: body,
  };
}


function generateNewAssessmentId() {
  const year = new Date().getFullYear();
  const nextIndex = FAKE_ASSESSMENTS.length + 1;
  return `ASM-${year}-${nextIndex.toString().padStart(3, "0").toUpperCase()}`;
}


export async function uploadDocuments(files: File[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const returnData = {
    success: true,
    files,
  }
  return returnData;
}
