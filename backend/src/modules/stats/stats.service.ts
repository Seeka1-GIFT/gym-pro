import { prisma } from "../../db/client";

export async function getOverview() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get basic counts
  const [
    totalMembers,
    activeMemberships,
    todayAttendance,
    monthlyAttendance,
    totalPlans,
    totalAssets
  ] = await Promise.all([
    prisma.member.count(),
    prisma.membership.count({
      where: {
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now }
      }
    }),
    prisma.attendance.count({
      where: {
        checkIn: { gte: startOfDay }
      }
    }),
    prisma.attendance.count({
      where: {
        checkIn: { gte: startOfMonth }
      }
    }),
    prisma.plan.count({
      where: { isActive: true }
    }),
    prisma.asset.count()
  ]);

  // Get revenue data
  const [
    monthlyRevenue,
    monthlyExpenses,
    totalRevenue,
    totalExpenses
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),
    prisma.expense.aggregate({
      where: {
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      _sum: { amount: true }
    }),
    prisma.expense.aggregate({
      _sum: { amount: true }
    })
  ]);

  // Get recent activities
  const [recentPayments, recentAttendances, recentExpenses] = await Promise.all([
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        member: {
          select: {
            fullName: true
          }
        }
      }
    }),
    prisma.attendance.findMany({
      take: 5,
      orderBy: { checkIn: "desc" },
      include: {
        member: {
          select: {
            fullName: true
          }
        }
      }
    }),
    prisma.expense.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);

  // Get membership status breakdown
  const membershipStatus = await prisma.membership.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  // Get payment method breakdown for this month
  const paymentMethods = await prisma.payment.groupBy({
    by: ['method'],
    where: {
      createdAt: { gte: startOfMonth }
    },
    _count: { method: true },
    _sum: { amount: true }
  });

  // Get expense category breakdown for this month
  const expenseCategories = await prisma.expense.groupBy({
    by: ['category'],
    where: {
      createdAt: { gte: startOfMonth }
    },
    _count: { category: true },
    _sum: { amount: true }
  });

  const monthRevenueNum = Number(monthlyRevenue._sum.amount ?? 0);
  const monthExpensesNum = Number(monthlyExpenses._sum.amount ?? 0);
  return {
    summary: {
      totalMembers,
      activeMemberships,
      todayAttendance,
      monthlyAttendance,
      totalPlans,
      totalAssets,
      monthlyRevenue: Number(totalRevenue._sum.amount ?? 0),
      monthlyExpenses: Number(totalExpenses._sum.amount ?? 0),
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      totalExpenses: Number(totalExpenses._sum.amount ?? 0),
      monthlyProfit: monthRevenueNum - monthExpensesNum
    },
    recentActivities: {
      payments: recentPayments,
      attendances: recentAttendances,
      expenses: recentExpenses
    },
    breakdowns: {
      membershipStatus,
      paymentMethods,
      expenseCategories
    }
  };
}
