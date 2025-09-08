import { api } from "../../lib/api";
import { normalizePage, Paginated, PageParams } from "../../lib/paginate";

export type Expense = { 
  id: string; 
  category: string; 
  amount: number; 
  note?: string; 
  spentAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function listExpenses(params: PageParams = {}): Promise<Paginated<Expense>> {
  const { q = "", page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/expenses", { params: { q, page, limit } });
  return normalizePage<Expense>(data, page, limit);
}

export async function createExpense(payload: Partial<Expense>) {
  const { data } = await api.post("/api/expenses", payload);
  return data;
}

export async function updateExpense(id: string, payload: Partial<Expense>) {
  const { data } = await api.patch(`/api/expenses/${id}`, payload);
  return data;
}

export async function deleteExpense(id: string) {
  const { data } = await api.delete(`/api/expenses/${id}`);
  return data;
}
