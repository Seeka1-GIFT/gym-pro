import { prisma } from "../../db/client.js";

export async function list(q?: string, category?: string, page = 1, limit = 10) {
  const where: any = {};
  
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } }
    ];
  }
  
  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }
  
  const [items, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.asset.count({ where })
  ]);

  return { items, total, page, limit };
}

export async function create(data: any) {
  return prisma.asset.create({ data });
}

export async function get(id: string) {
  return prisma.asset.findUnique({ where: { id } });
}

export async function update(id: string, data: any) {
  return prisma.asset.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.asset.delete({ where: { id } });
}


