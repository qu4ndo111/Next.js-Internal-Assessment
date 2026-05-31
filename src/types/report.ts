export interface MonthlyReportRow {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  inProgress: number;
  avgDays: number | null;
  claimedAmount: number;
  assessedAmount: number;
  claimType?: number;
}

export interface AssessorReportRow {
  assessor: string;
  total: number;
  approved: number;
  rejected: number;
  inProgress: number;
  avgDays: number | null;
  sla: number;
}
