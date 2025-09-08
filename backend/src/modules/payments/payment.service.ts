import { prisma } from "../../db/client";

export async function list(page = 1, limit = 10, memberId?: string) {
  const where = memberId ? { memberId } : {};
  
  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            phone: true
          }
        },
        membership: {
          select: {
            id: true,
            plan: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.payment.count({ where })
  ]);

  return { items, total, page, limit };
}

export async function create(data: any) {
  // Check if member exists
  const member = await prisma.member.findUnique({ where: { id: data.memberId } });
  if (!member) {
    throw Object.assign(new Error("Member not found"), { status: 404 });
  }

  // If membershipId is provided, check if it exists and belongs to the member
  if (data.membershipId) {
    const membership = await prisma.membership.findFirst({
      where: {
        id: data.membershipId,
        memberId: data.memberId
      }
    });

    if (!membership) {
      throw Object.assign(new Error("Membership not found or doesn't belong to member"), { status: 404 });
    }
  }

  return prisma.payment.create({
    data,
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      },
      membership: {
        select: {
          id: true,
          plan: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export async function get(id: string) {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      },
      membership: {
        select: {
          id: true,
          plan: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export async function update(id: string, data: any) {
  return prisma.payment.update({
    where: { id },
    data,
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      },
      membership: {
        select: {
          id: true,
          plan: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export async function remove(id: string) {
  return prisma.payment.delete({ where: { id } });
}
