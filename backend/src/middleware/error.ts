import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  const details = err?.details;
  if (process.env.NODE_ENV !== "production") {
    console.error("[Error]", err);
  }
  res.status(status).json({ error: message, details });
}
