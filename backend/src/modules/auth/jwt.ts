import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export function signAccess(payload: object) {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
}
