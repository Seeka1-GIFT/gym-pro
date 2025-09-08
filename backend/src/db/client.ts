import { PrismaClient } from "@prisma/client";
import { ENV } from "../config/env";

// Ensure DATABASE_URL supports SSL when deploying to managed Postgres (e.g., Neon)
// Add ?sslmode=require in the Render/Neon environment variable
if (!ENV.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("[db] DATABASE_URL is empty. Set it in your environment.");
}

export const prisma = new PrismaClient();
