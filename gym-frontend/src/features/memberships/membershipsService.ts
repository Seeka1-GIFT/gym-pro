import { api } from "../../lib/api";
import { normalizePage, Paginated } from "../../lib/paginate";

export type Membership = {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate?: string;
  status?: "ACTIVE" | "PAUSED" | "EXPIRED" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
  member?: {
    id: string;
    fullName: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
  };
};

export async function listMemberships(params = { page: 1, limit: 10 }): Promise<Paginated<Membership>> {
  const { page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/memberships", { params: { page, limit } });
  return normalizePage<Membership>(data, page, limit);
}

export async function createMembership(payload: {
  memberId: string; planId: string; startDate: string;
}): Promise<Membership> {
  const { data } = await api.post("/api/memberships", payload);
  return data;
}

export async function getMemberMemberships(memberId: string): Promise<Membership[]> {
  const { data } = await api.get(`/api/memberships/member/${memberId}`);
  return data;
}
