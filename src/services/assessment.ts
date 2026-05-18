"use server"

import { revalidatePath } from "next/cache";
import { FAKE_ASSESSMENTS } from "../data/assessments";
import { Assessment, AssessmentStatus, CreateAssessmentInput, ResponseAssessmentData } from "../types/assessment";
import { shouldSimulateError } from "../actions/error-simulator.action";

const assessmentsDB = [...FAKE_ASSESSMENTS];

export async function getAssessments(filters?: { status?: string; type?: string; search?: string; from?: string; to?: string, assignedTo?: string, page?: number, pageSize?: number }): Promise<ResponseAssessmentData> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in getAssessments")

  let data = [...assessmentsDB];

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
  if (filters?.from && filters?.to) {
    const from = new Date(filters.from);
    const to = new Date(filters.to);
    to.setHours(23, 59, 59, 999);
    data = data.filter((item) =>
      new Date(item.submittedAt).getTime() >= from.getTime() && new Date(item.submittedAt).getTime() <= to.getTime()
    );
  }
  if (filters?.assignedTo) {
    data = data.filter((item) => item.assignedTo === filters.assignedTo);
  }

  if (filters?.page && filters?.pageSize) {
    const page = filters.page - 1;
    const pageSize = filters.pageSize;
    const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
    return {
      totalCount: data.length,
      data: paginatedData,
    };
  }

  return {
    totalCount: data.length,
    data: data,
  };
}

export async function getAssessmentById(id: string): Promise<Assessment | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in getAssessmentById")

  return assessmentsDB.find(item => item.id === id);
}

export async function createAssessment(data: CreateAssessmentInput) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in createAssessment")

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
      url: `/documents/${file.name}`,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })),
    notes: data.notes,
  };

  assessmentsDB.unshift(body);

  revalidatePath("/assessments");

  return {
    success: true,
    data: body,
  };
}

export async function updateAssessment(id: string, status: AssessmentStatus, notes: string, assessedAmount?: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in updateAssessment")

  const index = assessmentsDB.findIndex((item) => item.id === id);
  if (index !== -1) {
    const assessment = { ...assessmentsDB[index] };
    assessment.status = status;

    if (status === "REJECTED") {
      assessment.rejectionReason = notes;
      assessment.reviewNote = undefined;
    } else {
      assessment.reviewNote = notes;
      assessment.rejectionReason = null;
    }

    if (assessedAmount !== undefined) {
      assessment.assessedAmount = assessedAmount;
    }

    if (["APPROVED", "REJECTED", "PARTIALLY_APPROVED"].includes(status)) {
      const now = new Date();
      assessment.completedAt = now.toISOString();
      
      const submittedAt = new Date(assessment.submittedAt);
      const diffTime = Math.abs(now.getTime() - submittedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      assessment.processingDays = diffDays;
      assessment.assessedAmount = assessment.claimedAmount;
    } else {
      assessment.completedAt = null;
      assessment.processingDays = null;
    }

    assessmentsDB[index] = { ...assessment };

    revalidatePath("/assessments");
    revalidatePath(`/assessments/${id}`);

    return {
      success: true,
      data: assessment,
    };
  }

  return {
    success: false,
    message: "Assessment not found",
  };
}


function generateNewAssessmentId() {
  const year = new Date().getFullYear();
  const nextIndex = FAKE_ASSESSMENTS.length + 1;
  return `ASM-${year}-${nextIndex.toString().padStart(3, "0").toUpperCase()}`;
}


export async function uploadDocuments(files: File[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in uploadDocuments")

  const returnData = {
    success: true,
    files,
  }
  return returnData;
}
