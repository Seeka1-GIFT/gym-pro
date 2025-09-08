import { api } from "../../lib/api";

export type StatsOverview = {
  membersTotal: number;
  activeMembers: number;
  attendanceToday: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  assetsCount: number;
};

export async function getStatsOverview(): Promise<StatsOverview> {
  const { data } = await api.get("/api/stats/overview");
  
  // Transform the backend response to match our expected format
  return {
    membersTotal: data.summary.totalMembers,
    activeMembers: data.summary.activeMemberships,
    attendanceToday: data.summary.todayAttendance,
    monthlyRevenue: data.summary.monthlyRevenue,
    monthlyExpenses: data.summary.monthlyExpenses,
    assetsCount: data.summary.totalAssets,
  };
}
