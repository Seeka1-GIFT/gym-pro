import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../modules/auth/jwt";
import type { Role } from "@prisma/client";

export function authGuard(roles?: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const payload = verifyAccess(token) as any;
      (req as any).user = payload;
      if (roles && roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
