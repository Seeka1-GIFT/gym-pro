import { Router } from "express";
import * as c from "./payment.controller";
import { authGuard } from "../../middleware/authGuard";

export const paymentRouter = Router();

paymentRouter.get("/", authGuard(), c.list);
paymentRouter.post("/", authGuard(["ADMIN", "RECEPTION"] as any), c.create);
paymentRouter.get("/:id", authGuard(), c.get);
paymentRouter.patch("/:id", authGuard(["ADMIN", "RECEPTION"] as any), c.update);
paymentRouter.delete("/:id", authGuard(["ADMIN"] as any), c.remove);
