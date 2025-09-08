import { Router } from "express";
import * as c from "./membership.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const membershipRouter = Router();

membershipRouter.post("/", authGuard(["ADMIN", "RECEPTION"] as any), c.create);
membershipRouter.get("/member/:id", authGuard(), c.listByMember);
membershipRouter.patch("/:id", authGuard(["ADMIN", "RECEPTION"] as any), c.patch);
