export const queryKeys = {
	members: {
		root: ['members'] as const,
		list: (params: { q: string; page: number; limit: number }) =>
			(['members', 'list', params] as const),
		detail: (id: string) => ['members', 'detail', id] as const,
	},
	stats: {
		overview: ['stats', 'overview'] as const,
	},
} as const;

export type QueryKey = ReadonlyArray<unknown>;

