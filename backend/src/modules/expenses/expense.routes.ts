import { Router } from "express";
import * as c from "./expense.controller.js";
import { authGuard } from "../../middleware/authGuard.js";

export const expenseRouter = Router();

expenseRouter.get("/", authGuard(), c.list);
expenseRouter.post("/", authGuard(["ADMIN"] as any), c.create);
expenseRouter.get("/:id", authGuard(), c.get);
expenseRouter.patch("/:id", authGuard(["ADMIN"] as any), c.update);
expenseRouter.delete("/:id", authGuard(["ADMIN"] as any), c.remove);
