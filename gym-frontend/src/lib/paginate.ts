export type PageParams = { q?: string; page?: number; limit?: number };

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export function normalizePage<T>(data: any, page = 1, limit = 10): Paginated<T> {
  // Accept common shapes: {items,total,page,limit} | {data,total,page,limit} | array
  if (Array.isArray(data)) {
    return { items: data as T[], total: data.length, page, limit };
  }
  const items = (data?.items ?? data?.data ?? data?.results ?? data?.rows ?? []) as T[];
  const total = Number(data?.total ?? items.length ?? 0);
  const p = Number(data?.page ?? page ?? 1);
  const l = Number(data?.limit ?? limit ?? 10);
  return { items, total, page: p, limit: l };
}
