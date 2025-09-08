import { api } from "../../lib/api";
import { normalizePage, Paginated, PageParams } from "../../lib/paginate";

export type Asset = { 
  id: string; 
  name: string; 
  category?: string; 
  serialNo?: string; 
  cost?: number; 
  condition?: string; 
  location?: string;
  purchaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function listAssets(params: PageParams = {}): Promise<Paginated<Asset>> {
  const { q = "", page = 1, limit = 10 } = params;
  const { data } = await api.get("/api/assets", { params: { q, page, limit } });
  return normalizePage<Asset>(data, page, limit);
}

export async function createAsset(payload: Partial<Asset>) {
  const { data } = await api.post("/api/assets", payload);
  return data;
}

export async function updateAsset(id: string, payload: Partial<Asset>) {
  const { data } = await api.patch(`/api/assets/${id}`, payload);
  return data;
}

export async function deleteAsset(id: string) {
  const { data } = await api.delete(`/api/assets/${id}`);
  return data;
}
