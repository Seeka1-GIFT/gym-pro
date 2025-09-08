import { Router } from "express";
import * as c from "./auth.controller";
import { authGuard } from "../../middleware/authGuard";

export const authRouter = Router();
authRouter.post("/register", c.register);
authRouter.post("/login", c.login);
authRouter.get("/me", authGuard(), c.me);
authRouter.post("/refresh", c.refresh);
authRouter.post("/logout", c.logout);
