import { prisma } from "../../db/client.js";

export async function create(data: { memberId: string; planId: string; startDate: string }) {
  const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
  if (!plan) throw Object.assign(new Error("Plan not found"), { status: 404 });
  
  const start = new Date(data.startDate);
  const end = new Date(start.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
  
  return prisma.membership.create({
    data: { 
      memberId: data.memberId, 
      planId: data.planId, 
      startDate: start, 
      endDate: end, 
      status: "ACTIVE" 
    }
  });
}

export async function listByMember(memberId: string) {
  return prisma.membership.findMany({ 
    where: { memberId }, 
    orderBy: { createdAt: "desc" }, 
    include: { plan: true } 
  });
}

export async function patch(id: string, action: "pause" | "resume" | "expire") {
  switch (action) {
    case "pause":
      return prisma.membership.update({ where: { id }, data: { status: "PAUSED" } });
    case "resume":
      return prisma.membership.update({ where: { id }, data: { status: "ACTIVE" } });
    case "expire":
      return prisma.membership.update({ where: { id }, data: { status: "EXPIRED" } });
  }
}
