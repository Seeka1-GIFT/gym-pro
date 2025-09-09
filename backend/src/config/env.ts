import "dotenv/config";

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "production",
  PORT: Number(process.env.PORT ?? 5000),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  CORS_ORIGIN: process.env.CORS_ORIGIN!
};
