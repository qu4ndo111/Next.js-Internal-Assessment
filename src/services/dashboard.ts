import { Assessment } from "@/src/types/assessment";

export async function getDashboardKPIs(data: Assessment[]) {
    const total = data.length;
    const inProgress = data.filter(d => ['PENDING', 'IN_REVIEW'].includes(d.status)).length;
    const approved = data.filter(d => d.status === 'APPROVED').length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

    return {
        totalAssessments: total,
        inProgress,
        approvalRate: `${approvalRate}%`,
        avgProcessingTime: 3.7,
    };
}

export async function getVolumeByMonth(data: Assessment[]) {
    const result = data.reduce((acc, assessment) => {
        const monthNum = new Date(assessment.submittedAt).getMonth() + 1;
        const existingMonth = acc.find(item => item.monthNum === monthNum);
        if (existingMonth) {
            existingMonth.volume++;
        } else {
            acc.push({ monthNum, volume: 1 });
        }
        return acc;
    }, [] as { monthNum: number; volume: number }[])
        .sort((a, b) => a.monthNum - b.monthNum)
        .map(item => ({
            month: `Tháng ${item.monthNum}`,
            volume: item.volume
        }));

    return result
}

export async function getTypeDistribution(data: Assessment[]) {
    return data.reduce((acc, assessment) => {
        const type = assessment.claimType;
        const existingType = acc.find(item => item.type === type);
        if (existingType) {
            existingType.value++;
        } else {
            acc.push({ type, value: 1 });
        }
        return acc;
    }, [] as { type: string; value: number }[])
}

export async function getProcessingTime(data: Assessment[]) {
    return data.reduce((acc, item) => {
        const monthNum = new Date(item.submittedAt).getMonth() + 1;
        const existingMonth = acc.find(item => item.monthNum === monthNum);
        if (existingMonth) {
            existingMonth.avgDays = (existingMonth.avgDays * existingMonth.count + (item.processingDays ?? 0)) / (existingMonth.count + 1);
            existingMonth.count++;
        } else {
            acc.push({ monthNum, avgDays: item.processingDays ?? 0, count: item.processingDays ? 1 : 0 });
        }
        return acc;
    }, [] as { monthNum: number; avgDays: number; count: number }[])
        .sort((a, b) => a.monthNum - b.monthNum)
        .map(item => ({
            month: `Tháng ${item.monthNum}`,
            avgDays: item.avgDays,
            target: 5,
        }))
}

export async function getApprovalRate(data: Assessment[]) {
    return data.reduce((acc, item) => {
        const key = item.status;
        const existing = acc.find(i => i.status === key);
        if (existing) {
            existing.value++;
        } else {
            acc.push({ status: key, value: 1 });
        }
        return acc;
    }, [] as { status: string; value: number }[])
        .sort((a, b) => b.value - a.value)
}