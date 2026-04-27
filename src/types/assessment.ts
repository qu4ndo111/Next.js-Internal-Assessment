export type AssessmentStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "ADDITIONAL_INFO_REQUESTED"
  | "APPROVED"
  | "PARTIALLY_APPROVED"
  | "REJECTED";

export type AssessmentPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ClaimType = "MEDICAL" | "ACCIDENT" | "PROPERTY" | "DEATH" | "DISABILITY";

export interface AssessmentDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface Assessment {
  id: string; // "ASM-2024-008821"
  claimId: string; // "CLM-2024-001234"
  claimType: ClaimType;
  insuredName: string;
  contractNo: string;
  claimedAmount: number;
  assessedAmount: number | null;
  priority: AssessmentPriority;
  status: AssessmentStatus;
  assignedTo: string; // assessor name
  submittedAt: string;
  deadline: string;
  completedAt: string | null;
  processingDays: number | null;
  rejectionReason: string | null;
  documents: AssessmentDocument[];
  notes: string;
}

export interface CreateAssessmentInput {
  claimId: string;
  claimType: ClaimType;
  insuredName: string;
  contractNo: string;
  claimedAmount: number;
  priority: AssessmentPriority;
  assignedTo: string;
  deadline: Date;
  documents: File[];
  notes: string;
}