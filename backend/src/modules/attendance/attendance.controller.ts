import type { Request, Response } from "express";
import { attendanceCheckInSchema, attendanceCheckOutSchema } from "./attendance.schema.js";
import * as svc from "./attendance.service.js";

export async function checkIn(req: Request, res: Response) {
  const body = attendanceCheckInSchema.parse(req.body);
  const attendance = await svc.checkIn(body);
  res.status(201).json(attendance);
}

export async function checkOut(req: Request, res: Response) {
  const body = attendanceCheckOutSchema.parse(req.body);
  const attendance = await svc.checkOut(body.attendanceId);
  res.json(attendance);
}

export async function list(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const memberId = req.query.memberId as string | undefined;
  
  res.json(await svc.list(page, limit, memberId));
}
