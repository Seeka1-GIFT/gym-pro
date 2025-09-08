export const ok = (data: unknown = {}, meta: unknown = {}) => ({ success: true, data, meta });
export const fail = (message: string, details?: unknown) => ({ success: false, error: message, details });
