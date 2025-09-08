import { prisma } from "../../db/client";

export async function list(q: string | undefined, page = 1, limit = 10) {
  const where = q
    ? {
        OR: [
          { fullName: { contains: q, mode: 'insensitive' as const } },
          { phone: { contains: q } },
        ],
      }
    : {};
  
  const [items, total] = await Promise.all([
    prisma.member.findMany({ 
      where, 
      skip: (page - 1) * limit, 
      take: limit, 
      orderBy: { createdAt: "desc" } 
    }),
    prisma.member.count({ where })
  ]);
  
  return { items, total, page, limit };
}

export const get = (id: string) => prisma.member.findUnique({ where: { id } });

export const create = (data: any) => prisma.member.create({ data });

export const update = (id: string, data: any) => prisma.member.update({ where: { id }, data });

export const remove = (id: string) => prisma.member.delete({ where: { id } });
