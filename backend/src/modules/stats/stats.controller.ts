import type { Request, Response } from "express";
import * as svc from "./stats.service.js";

export async function getOverview(req: Request, res: Response) {
  const overview = await svc.getOverview();
  res.json(overview);
}
