import { api } from "../../lib/api";
import { normalizePage, Paginated } from "../../lib/paginate";

export type Plan = { 
  id: string; 
  name: string; 
  description?: string;
  price: number; 
  durationDays: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function listPlans(): Promise<Paginated<Plan>> {
  const { data } = await api.get("/api/plans");
  return normalizePage<Plan>(data, 1, 50);
}

export async function createPlan(payload: Partial<Plan>): Promise<Plan> {
  const { data } = await api.post("/api/plans", payload);
  return data;
}

export async function updatePlan(id: string, payload: Partial<Plan>): Promise<Plan> {
  const { data } = await api.patch(`/api/plans/${id}`, payload);
  return data;
}

export async function deletePlan(id: string) {
  const { data } = await api.delete(`/api/plans/${id}`);
  return data;
}
