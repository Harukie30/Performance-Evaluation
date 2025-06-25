import { notFound } from "next/navigation";
import { CheckCircle2, AlertCircle, TrendingUp, Info, Printer } from "lucide-react";
import PerformanceSummaryClient from "./PerformanceSummaryClient";


interface PageParams {
  params: { id: string };
}

export async function generateMetadata({ params }: PageParams) {
  return {
    title: `Performance Review - ${params.id}`,
    description: "Detailed performance review for employee."
  };
}

export default async function PerformanceReviewPage({ params }: PageParams) {
  const { id } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/performance-review/${id}`, {
    cache: "no-store"
  });

  if (!res.ok) return notFound();

  const evaluation = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-2">
      <PerformanceSummaryClient evaluation={evaluation} />
    </div>
  );
}
