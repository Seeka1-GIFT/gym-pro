import { Router } from "express";
import * as c from "./asset.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const assetRouter = Router();

assetRouter.get("/", authGuard(), c.list);
assetRouter.post("/", authGuard(["ADMIN"] as any), c.create);
assetRouter.get("/:id", authGuard(), c.get);
assetRouter.patch("/:id", authGuard(["ADMIN"] as any), c.update);
assetRouter.delete("/:id", authGuard(["ADMIN"] as any), c.remove);


