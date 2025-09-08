import { Router } from "express";
import * as c from "./plan.controller";
import { authGuard } from "../../middleware/authGuard";

export const planRouter = Router();

planRouter.get("/", authGuard(), c.list);
planRouter.post("/", authGuard(["ADMIN"] as any), c.create);
planRouter.patch("/:id", authGuard(["ADMIN"] as any), c.update);
planRouter.delete("/:id", authGuard(["ADMIN"] as any), c.remove);
