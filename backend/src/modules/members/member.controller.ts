import type { Request, Response } from "express";
import { memberCreateSchema, memberUpdateSchema } from "./member.schema.js";
import * as svc from "./member.service.js";

export async function list(req: Request, res: Response) {
  const q = (req.query.q as string) || undefined;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  res.json(await svc.list(q, page, limit));
}

export async function create(req: Request, res: Response) {
  const body = memberCreateSchema.parse(req.body);
  const m = await svc.create(body);
  res.status(201).json(m);
}

export async function get(req: Request, res: Response) {
  const m = await svc.get(req.params.id);
  if (!m) return res.status(404).json({ error: "Not found" });
  res.json(m);
}

export async function update(req: Request, res: Response) {
  const body = memberUpdateSchema.parse(req.body);
  res.json(await svc.update(req.params.id, body));
}

export async function remove(req: Request, res: Response) {
  await svc.remove(req.params.id);
  res.json({ ok: true });
}
