import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Assessment } from "@/src/types/assessment";

export interface DashboardQueryParams {
    from: string;
    to: string;
    period: string;
    type: string;
}

export interface DashboardData {
    kpiData: {
        totalAssessments: number;
        inProgress: number;
        approvalRate: string;
        avgProcessingTime: string;
        trends: {
            total: { value: string; isUp: boolean | null };
            inProgress: { value: string; isUp: boolean | null };
            approvalRate: { value: string; isUp: boolean | null };
            avgProcessingTime: { value: string; isUp: boolean | null };
        };
    };
    volumeData: Array<{ month: number; volume: number }>;
    typeDistributionData: Array<{ type: string; value: number }>;
    processingTimeData: Array<{ month: number; avgDays: number; target: number }>;
    approvalRateData: Array<{ status: string; value: number }>;
    fullyFilteredAssessments: Array<Assessment>;
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api'}),
    endpoints: (builder) => (
        {
            getDashboardData: builder.query<DashboardData, DashboardQueryParams>({
                query: (params) => (
                    {
                        url: '/dashboard',
                        method: "GET",
                        params: params
                    }
                ),
                keepUnusedDataFor: 300
            }),
        }
    )
});

export const { useGetDashboardDataQuery } = dashboardApi;