import type { Request, Response } from "express";
import { assetCreateSchema, assetUpdateSchema } from "./asset.schema.js";
import * as svc from "./asset.service.js";

export async function list(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const category = req.query.category as string | undefined;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  
  res.json(await svc.list(q, category, page, limit));
}

export async function create(req: Request, res: Response) {
  const body = assetCreateSchema.parse(req.body);
  const asset = await svc.create(body);
  res.status(201).json(asset);
}

export async function get(req: Request, res: Response) {
  const asset = await svc.get(req.params.id);
  if (!asset) return res.status(404).json({ error: "Not found" });
  res.json(asset);
}

export async function update(req: Request, res: Response) {
  const body = assetUpdateSchema.parse(req.body);
  res.json(await svc.update(req.params.id, body));
}

export async function remove(req: Request, res: Response) {
  await svc.remove(req.params.id);
  res.json({ ok: true });
}


