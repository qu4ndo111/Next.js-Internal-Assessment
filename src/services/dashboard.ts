import { Assessment } from "@/src/types/assessment";

function calculateStats(data: Assessment[]) {
    const total = data.length;
    const inProgress = data.filter(d => ['PENDING', 'IN_REVIEW'].includes(d.status)).length;
    const approved = data.filter(d => d.status === 'APPROVED').length;
    const approvalRate = total > 0 ? (approved / total) * 100 : 0;
    const completedItems = data.filter(d => d.processingDays !== null);
    const avgProcessingTime = completedItems.length > 0
        ? (completedItems.reduce((sum, d) => sum + (d.processingDays ?? 0), 0) / completedItems.length)
        : 0;

    return { total, inProgress, approvalRate, avgProcessingTime };
}

function calculateTrend(current: number, previous: number) {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const diff = ((current - previous) / previous) * 100;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}%`;
}

export async function getDashboardKPIs(data: Assessment[], previousData?: Assessment[]) {
    const current = calculateStats(data);
    
    const result = {
        totalAssessments: current.total,
        inProgress: current.inProgress,
        approvalRate: `${current.approvalRate.toFixed(1)}%`,
        avgProcessingTime: current.avgProcessingTime.toFixed(1),
        trends: {
            total: { value: "0%", isUp: true as boolean | null },
            inProgress: { value: "0%", isUp: true as boolean | null },
            approvalRate: { value: "0%", isUp: true as boolean | null },
            avgProcessingTime: { value: "0%", isUp: true as boolean | null },
        }
    };

    if (previousData) {
        const previous = calculateStats(previousData);
        
        const totalDiff = current.total - previous.total;
        const inProgressDiff = current.inProgress - previous.inProgress;
        const approvalRateDiff = current.approvalRate - previous.approvalRate;
        const processingTimeDiff = current.avgProcessingTime - previous.avgProcessingTime;

        result.trends = {
            total: { 
                value: calculateTrend(current.total, previous.total), 
                isUp: totalDiff >= 0 
            },
            inProgress: { 
                value: calculateTrend(current.inProgress, previous.inProgress), 
                isUp: inProgressDiff >= 0 
            },
            approvalRate: { 
                value: calculateTrend(current.approvalRate, previous.approvalRate), 
                isUp: approvalRateDiff >= 0 
            },
            avgProcessingTime: { 
                value: calculateTrend(current.avgProcessingTime, previous.avgProcessingTime), 
                isUp: processingTimeDiff <= 0
            },
        };
    }

    return result;
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
            month: item.monthNum,
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
            month: item.monthNum,
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