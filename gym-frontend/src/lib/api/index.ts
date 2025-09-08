// Deprecated lightweight fetch helpers were replaced by centralized axios client in ../api.ts
// Keep a minimal shim for legacy imports to avoid breaking changes.
import apiAx from '../api';

export const api = apiAx;
export default apiAx;