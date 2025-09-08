import { Router } from "express";
import * as c from "./attendance.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const attendanceRouter = Router();

attendanceRouter.post("/check-in", authGuard(["ADMIN", "RECEPTION", "TRAINER"] as any), c.checkIn);
attendanceRouter.post("/check-out", authGuard(["ADMIN", "RECEPTION", "TRAINER"] as any), c.checkOut);
attendanceRouter.get("/", authGuard(), c.list);
