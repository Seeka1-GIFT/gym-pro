import { api } from "../../lib/api";
import { normalizePage, Paginated, PageParams } from "../../lib/paginate";

export type Payment = { 
  id: string; 
  memberId: string; 
  membershipId?: string; 
  amount: number; 
  method: string; 
  reference?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  member?: {
    id: string;
    fullName: string;
  };
  membership?: {
    id: string;
    plan: {
      name: string;
    };
  };
};

export async function listPayments(params: PageParams = {}): Promise<Paginated<Payment>> {
  const { q = "", page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/payments", { params: { q, page, limit } });
  return normalizePage<Payment>(data, page, limit);
}

export async function createPayment(payload: Partial<Payment>): Promise<Payment> {
  const { data } = await api.post("/api/payments", payload);
  return data;
}
