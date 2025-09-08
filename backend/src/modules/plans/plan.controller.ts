import type { Request, Response } from "express";
import { planCreateSchema, planUpdateSchema } from "./plan.schema";
import * as svc from "./plan.service";

export const list = async (_: Request, res: Response) => res.json(await svc.list());

export const create = async (req: Request, res: Response) => {
  const body = planCreateSchema.parse(req.body);
  res.status(201).json(await svc.create(body));
};

export const update = async (req: Request, res: Response) => {
  const body = planUpdateSchema.parse(req.body);
  res.json(await svc.update(req.params.id, body));
};

export const remove = async (req: Request, res: Response) => {
  await svc.remove(req.params.id);
  res.json({ ok: true });
};
