"use server"

import { FAKE_ASSESSMENTS } from "../data/assessments";
import { MonthlyReportRow, AssessorReportRow } from "../types/report";
import { shouldSimulateError } from "../actions/error-simulator.action";

export interface ReportFilters {
  from?: string;
  to?: string;
  type?: string;
}

export async function getMonthlyReportData(filters?: ReportFilters): Promise<MonthlyReportRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error")

  let filteredData = [...FAKE_ASSESSMENTS];

  if (filters?.from) {
    const fromDate = new Date(filters.from);
    filteredData = filteredData.filter((item) => new Date(item.submittedAt) >= fromDate);
  }
  if (filters?.to) {
    const toDate = new Date(filters.to);
    toDate.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter((item) => new Date(item.submittedAt) <= toDate);
  }

  if (filters?.type && filters.type !== "all") {
    filteredData = filteredData.filter((item) => item.claimType === filters.type);
  }

  const groups: Record<string, typeof FAKE_ASSESSMENTS> = {};
  filteredData.forEach((item) => {
    const date = new Date(item.submittedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(item);
  });

  const reportRows: MonthlyReportRow[] = Object.keys(groups).map((month) => {
    const items = groups[month];
    const total = items.length;
    const approved = items.filter((i) => ["APPROVED", "PARTIALLY_APPROVED"].includes(i.status)).length;
    const rejected = items.filter((i) => i.status === "REJECTED").length;
    const inProgress = items.filter((i) => ["PENDING", "IN_REVIEW", "ADDITIONAL_INFO_REQUESTED"].includes(i.status)).length;

    const completedItems = items.filter((i) => i.processingDays !== null);
    const sumDays = completedItems.reduce((acc, curr) => acc + (curr.processingDays || 0), 0);
    const avgDays = completedItems.length > 0 ? parseFloat((sumDays / completedItems.length).toFixed(1)) : null;

    const claimedAmount = items.reduce((acc, curr) => acc + curr.claimedAmount, 0);
    const assessedAmount = items.reduce((acc, curr) => acc + (curr.assessedAmount || 0), 0);

    return {
      month,
      total,
      approved,
      rejected,
      inProgress,
      avgDays,
      claimedAmount,
      assessedAmount,
    };
  });

  return reportRows.sort((a, b) => a.month.localeCompare(b.month));
}

export async function getAssessorReportData(filters?: ReportFilters): Promise<AssessorReportRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error")

  let filteredData = [...FAKE_ASSESSMENTS];

  if (filters?.from) {
    const fromDate = new Date(filters.from);
    filteredData = filteredData.filter((item) => new Date(item.submittedAt) >= fromDate);
  }
  if (filters?.to) {
    const toDate = new Date(filters.to);
    toDate.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter((item) => new Date(item.submittedAt) <= toDate);
  }
  if (filters?.type && filters.type !== "all") {
    filteredData = filteredData.filter((item) => item.claimType === filters.type);
  }

  const groups: Record<string, typeof FAKE_ASSESSMENTS> = {};
  filteredData.forEach((item) => {
    const assessor = item.assignedTo || "Unassigned";
    if (!groups[assessor]) {
      groups[assessor] = [];
    }
    groups[assessor].push(item);
  });

  const reportRows: AssessorReportRow[] = Object.keys(groups).map((assessor) => {
    const items = groups[assessor];
    const total = items.length;
    
    const approved = items.filter((i) => ["APPROVED", "PARTIALLY_APPROVED"].includes(i.status)).length;
    const rejected = items.filter((i) => i.status === "REJECTED").length;
    const completed = approved + rejected;
    const inProgress = items.filter((i) => ["PENDING", "IN_REVIEW", "ADDITIONAL_INFO_REQUESTED"].includes(i.status)).length;

    const completedItems = items.filter((i) => i.processingDays !== null);
    const sumDays = completedItems.reduce((acc, curr) => acc + (curr.processingDays || 0), 0);
    const avgDays = completedItems.length > 0 ? parseFloat((sumDays / completedItems.length).toFixed(1)) : null;

    const onTimeItems = completedItems.filter((i) => {
      if (!i.completedAt || !i.deadline) return false;
      return new Date(i.completedAt) <= new Date(i.deadline);
    });
    const sla = completed > 0 ? Math.round((onTimeItems.length / completed) * 100) : 100;

    return {
      assessor,
      total,
      approved,
      rejected,
      inProgress,
      avgDays,
      sla,
    };
  });

  return reportRows.sort((a, b) => b.total - a.total);
}
