import type { Request, Response } from "express";
import { membershipCreateSchema, membershipPatchSchema } from "./membership.schema.js";
import * as svc from "./membership.service.js";

export async function create(req: Request, res: Response) {
  const body = membershipCreateSchema.parse(req.body);
  const m = await svc.create(body);
  res.status(201).json(m);
}

export const listByMember = async (req: Request, res: Response) => {
  res.json(await svc.listByMember(req.params.id));
};

export async function patch(req: Request, res: Response) {
  const body = membershipPatchSchema.parse(req.body);
  res.json(await svc.patch(req.params.id, body.action));
}
