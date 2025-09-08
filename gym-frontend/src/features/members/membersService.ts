import { api } from "../../lib/api";
import { normalizePage, PageParams, Paginated } from "../../lib/paginate";

export type Member = { 
  id: string; 
  name: string; 
  fullName?: string;
  phone?: string; 
  email?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalConditions?: string;
  isActive?: boolean; 
  createdAt?: string;
  updatedAt?: string;
};

export async function listMembers(params: PageParams = {}): Promise<Paginated<Member>> {
  const { q = "", page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/members", { params: { q, page, limit } });
  return normalizePage<Member>(data, page, limit);
}

export async function getMember(id: string): Promise<Member> {
  const { data } = await api.get(`/api/members/${id}`);
  return data;
}

export async function createMember(payload: Partial<Member>): Promise<Member> {
  const { data } = await api.post("/api/members", payload);
  return data;
}

export async function updateMember(id: string, payload: Partial<Member>): Promise<Member> {
  const { data } = await api.patch(`/api/members/${id}`, payload);
  return data;
}

export async function deleteMember(id: string): Promise<{ ok: boolean }> {
  const { data } = await api.delete(`/api/members/${id}`);
  return data;
}
