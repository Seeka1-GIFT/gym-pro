import type { Request, Response } from "express";
import { paymentCreateSchema, paymentUpdateSchema } from "./payment.schema";
import * as svc from "./payment.service";

export async function list(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const memberId = req.query.memberId as string | undefined;
  
  res.json(await svc.list(page, limit, memberId));
}

export async function create(req: Request, res: Response) {
  const body = paymentCreateSchema.parse(req.body);
  const payment = await svc.create(body);
  res.status(201).json(payment);
}

export async function get(req: Request, res: Response) {
  const payment = await svc.get(req.params.id);
  if (!payment) return res.status(404).json({ error: "Not found" });
  res.json(payment);
}

export async function update(req: Request, res: Response) {
  const body = paymentUpdateSchema.parse(req.body);
  res.json(await svc.update(req.params.id, body));
}

export async function remove(req: Request, res: Response) {
  await svc.remove(req.params.id);
  res.json({ ok: true });
}
