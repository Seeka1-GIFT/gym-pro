import { prisma } from "../../db/client.js";

export async function checkIn(data: { memberId: string; source: string }) {
  // Check if member exists
  const member = await prisma.member.findUnique({ where: { id: data.memberId } });
  if (!member) {
    throw Object.assign(new Error("Member not found"), { status: 404 });
  }

  // Check if member has an active membership
  const activeMembership = await prisma.membership.findFirst({
    where: {
      memberId: data.memberId,
      status: "ACTIVE",
      startDate: { lte: new Date() },
      endDate: { gte: new Date() }
    }
  });

  if (!activeMembership) {
    throw Object.assign(new Error("Member has no active membership"), { status: 400 });
  }

  // Check if member is already checked in (no check-out)
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      memberId: data.memberId,
      checkOut: null
    }
  });

  if (existingAttendance) {
    throw Object.assign(new Error("Member is already checked in"), { status: 400 });
  }

  return prisma.attendance.create({
    data: {
      memberId: data.memberId,
      source: data.source as any
    },
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      }
    }
  });
}

export async function checkOut(attendanceId: string) {
  const attendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      }
    }
  });

  if (!attendance) {
    throw Object.assign(new Error("Attendance record not found"), { status: 404 });
  }

  if (attendance.checkOut) {
    throw Object.assign(new Error("Member is already checked out"), { status: 400 });
  }

  return prisma.attendance.update({
    where: { id: attendanceId },
    data: { checkOut: new Date() },
    include: {
      member: {
        select: {
          id: true,
          fullName: true,
          phone: true
        }
      }
    }
  });
}

export async function list(page = 1, limit = 10, memberId?: string) {
  const where = memberId ? { memberId } : {};
  
  const [items, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { checkIn: "desc" },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            phone: true
          }
        }
      }
    }),
    prisma.attendance.count({ where })
  ]);

  return { items, total, page, limit };
}
