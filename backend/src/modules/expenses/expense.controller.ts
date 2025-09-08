import type { Request, Response } from "express";
import { expenseCreateSchema, expenseUpdateSchema } from "./expense.schema.js";
import * as svc from "./expense.service.js";

export async function list(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const category = req.query.category as string | undefined;
  
  res.json(await svc.list(page, limit, category));
}

export async function create(req: Request, res: Response) {
  const body = expenseCreateSchema.parse(req.body);
  const expense = await svc.create(body);
  res.status(201).json(expense);
}

export async function get(req: Request, res: Response) {
  const expense = await svc.get(req.params.id);
  if (!expense) return res.status(404).json({ error: "Not found" });
  res.json(expense);
}

export async function update(req: Request, res: Response) {
  const body = expenseUpdateSchema.parse(req.body);
  res.json(await svc.update(req.params.id, body));
}

export async function remove(req: Request, res: Response) {
  await svc.remove(req.params.id);
  res.json({ ok: true });
}
