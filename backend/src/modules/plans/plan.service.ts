import { prisma } from "../../db/client";

export const list = () => prisma.plan.findMany({ orderBy: { createdAt: "desc" } });

export const create = (data: { name: string; price: number; durationDays: number; isActive?: boolean }) => prisma.plan.create({ data });

export const update = (id: string, data: Partial<{ name: string; price: number; durationDays: number; isActive?: boolean }>) => prisma.plan.update({ where: { id }, data });

export const remove = (id: string) => prisma.plan.delete({ where: { id } });
