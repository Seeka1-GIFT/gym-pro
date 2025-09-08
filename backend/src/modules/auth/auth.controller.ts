import { registerSchema, loginSchema } from "./auth.schema";
import * as svc from "./auth.service";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);
  const user = await svc.register(body);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await svc.login(body.email, body.password);
  res.json(result);
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.sub as string;
  const user = await svc.me(userId);
  res.json({ user });
}

export async function refresh(req: Request, res: Response) {
  const token = (req.body?.refreshToken || "") as string;
  const data = await svc.refresh(token);
  res.json(data);
}

export async function logout(req: Request, res: Response) {
  const token = (req.body?.refreshToken || "") as string;
  const data = await svc.logout(token);
  res.json(data);
}
