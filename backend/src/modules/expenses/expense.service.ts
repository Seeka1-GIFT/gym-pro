import { prisma } from "../../db/client.js";

export async function list(page = 1, limit = 10, category?: string) {
  const where = category ? { category: category as any } : {};
  
  const [items, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.expense.count({ where })
  ]);

  return { items, total, page, limit };
}

export async function create(data: any) {
  return prisma.expense.create({ data });
}

export async function get(id: string) {
  return prisma.expense.findUnique({ where: { id } });
}

export async function update(id: string, data: any) {
  return prisma.expense.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.expense.delete({ where: { id } });
}
