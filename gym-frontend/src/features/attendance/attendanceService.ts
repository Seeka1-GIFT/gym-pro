import { api } from "../../lib/api";
import { normalizePage, Paginated, PageParams } from "../../lib/paginate";

export type Attendance = { 
  id: string; 
  memberId: string; 
  checkInTime: string; 
  checkOutTime?: string; 
  source: string;
  createdAt?: string;
  updatedAt?: string;
  member?: {
    id: string;
    fullName: string;
  };
};

export async function listAttendance(params: PageParams = {}): Promise<Paginated<Attendance>> {
  const { q = "", page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/attendance", { params: { q, page, limit } });
  return normalizePage<Attendance>(data, page, limit);
}

export async function checkIn(memberId: string, source = "MANUAL") {
  const { data } = await api.post("/api/attendance/check-in", { memberId, source });
  return data;
}

export async function checkOut(attendanceId: string) {
  const { data } = await api.post("/api/attendance/check-out", { attendanceId });
  return data;
}
