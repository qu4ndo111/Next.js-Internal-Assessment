import { FAKE_ASSESSMENTS } from "@/src/data/assessments";
import { getApprovalRate, getDashboardKPIs, getProcessingTime, getTypeDistribution, getVolumeByMonth } from "@/src/services/dashboard";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const period = searchParams.get('period');
        const type = searchParams.get('type');

        if (!from || !to || !period || !type) {
            return NextResponse.json(
                { error: "Missing required parameters: 'from' and 'to'" },
                { status: 400 }
            );
        }

        const dateFilteredAssessments = FAKE_ASSESSMENTS.filter(a => {
            const submitDate = new Date(a.submittedAt).toISOString().split('T')[0];
            return submitDate >= from && submitDate <= to;
        });

        const fullyFilteredAssessments = dateFilteredAssessments.filter(a => {
            if (type !== "all") {
                return a.claimType === type;
            }
            return true;
        });

        const fromDate = new Date(from);
        const toDate = new Date(to);
        const diffInMs = toDate.getTime() - fromDate.getTime();

        const previousToDate = new Date(fromDate.getTime() - (24 * 60 * 60 * 1000));
        const previousFromDate = new Date(previousToDate.getTime() - diffInMs);

        const prevFromStr = previousFromDate.toISOString().split('T')[0];
        const prevToStr = previousToDate.toISOString().split('T')[0];

        const previousFilteredAssessments = FAKE_ASSESSMENTS.filter(a => {
            const submitDate = new Date(a.submittedAt).toISOString().split('T')[0];
            return submitDate >= prevFromStr && submitDate <= prevToStr;
        });

        const kpiData = await getDashboardKPIs(fullyFilteredAssessments, previousFilteredAssessments);
        const volumeData = await getVolumeByMonth(fullyFilteredAssessments);
        const typeDistributionData = await getTypeDistribution(dateFilteredAssessments);
        const processingTimeData = await getProcessingTime(fullyFilteredAssessments);
        const approvalRateData = await getApprovalRate(fullyFilteredAssessments);

        return NextResponse.json({
            kpiData,
            volumeData,
            typeDistributionData,
            processingTimeData,
            approvalRateData,
            fullyFilteredAssessments
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}