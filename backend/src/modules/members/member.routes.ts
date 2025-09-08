import { Router } from "express";
import * as c from "./member.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const memberRouter = Router();

memberRouter.get("/", authGuard(), c.list);
memberRouter.post("/", authGuard(["ADMIN", "RECEPTION", "TRAINER"] as any), c.create);
memberRouter.get("/:id", authGuard(), c.get);
memberRouter.patch("/:id", authGuard(["ADMIN", "RECEPTION", "TRAINER"] as any), c.update);
memberRouter.delete("/:id", authGuard(["ADMIN"] as any), c.remove);
