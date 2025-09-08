import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./modules/auth/auth.routes";
import { memberRouter } from "./modules/members/member.routes";
import { planRouter } from "./modules/plans/plan.routes";
import { membershipRouter } from "./modules/memberships/membership.routes";
import { attendanceRouter } from "./modules/attendance/attendance.routes";
import { paymentRouter } from "./modules/payments/payment.routes";
import { expenseRouter } from "./modules/expenses/expense.routes";
import { assetRouter } from "./modules/assets/asset.routes";
import { statsRouter } from "./modules/stats/stats.routes";
import { swaggerConfig } from "./docs/swagger";

export const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowed = ENV.CORS_ORIGIN.length ? ENV.CORS_ORIGIN : undefined;
app.use(
  cors({
    origin: allowed ?? true,
    credentials: true,
  })
);

// Auth routes
app.use("/api/auth", authRouter);

// Core gym modules
app.use("/api/members", memberRouter);
app.use("/api/plans", planRouter);
app.use("/api/memberships", membershipRouter);

// Attendance & Payments modules
app.use("/api/attendance", attendanceRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/assets", assetRouter);
app.use("/api/stats", statsRouter);

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// Health check
app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: "gym-backend", time: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

// error middleware (must be last)
app.use(errorHandler);
