import { Router } from "express";
import * as c from "./stats.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const statsRouter = Router();

statsRouter.get("/overview", authGuard(), c.getOverview);
