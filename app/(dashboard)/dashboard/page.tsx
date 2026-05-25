import { redirect } from "next/navigation";
import DashboardClient from "./_components/dashboard-client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = params.period || "filter6Months";
  const type = params.type || "all";

  if (!params.from || !params.to) {
    const now = new Date();
    const to = now.toISOString().split("T")[0];
    const from6m = new Date(now.setMonth(now.getMonth() - 5)).toISOString().split("T")[0];
    redirect(`/dashboard?period=${period}&from=${from6m}&to=${to}${type !== "all" ? `&type=${type}` : ""}`);
  }

  return <DashboardClient from={params.from} to={params.to} period={period} type={type} />;
}
