import React from "react";
import { useStatsOverview } from "../stats/useStatsOverview";

export default function Dashboard() {
  const { data, isLoading, isError, refetch, error } = useStatsOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-slate-500">Loading dashboard…</div>
      </div>
    );
  }

  if (isError || !data) {
    console.error("Dashboard load error:", error);
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-2xl font-semibold">Dashboard Error</div>
        <p className="text-slate-500">Failed to load dashboard data. Please try again.</p>
        <button onClick={() => refetch()} className="px-4 py-2 rounded bg-blue-600 text-white">
          Reload Page
        </button>
      </div>
    );
  }

  const cards: { label: string; value: number }[] = [
    { label: "Members", value: data.membersTotal },
    { label: "Active Members", value: data.activeMembers },
    { label: "Attendance Today", value: data.attendanceToday },
    { label: "Monthly Revenue", value: data.monthlyRevenue },
    { label: "Monthly Expenses", value: data.monthlyExpenses },
    { label: "Assets", value: data.assetsCount },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border p-4 bg-white">
          <div className="text-sm text-slate-500">{c.label}</div>
          <div className="text-2xl font-semibold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}