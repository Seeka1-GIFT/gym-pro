import { z } from "zod";

export const paymentCreateSchema = z.object({
  memberId: z.string().min(1),
  membershipId: z.string().optional(),
  amount: z.number().positive(),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY"]).default("CASH"),
  reference: z.string().optional(),
  notes: z.string().optional()
});

export const paymentUpdateSchema = paymentCreateSchema.partial();
