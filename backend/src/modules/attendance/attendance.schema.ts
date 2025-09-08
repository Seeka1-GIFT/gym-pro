import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  memberId: z.string().min(1),
  source: z.enum(["MANUAL", "QR_CODE", "FINGERPRINT"]).default("MANUAL")
});

export const attendanceCheckOutSchema = z.object({
  attendanceId: z.string().min(1)
});
