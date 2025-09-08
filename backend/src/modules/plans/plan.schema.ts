import { z } from "zod";

export const planCreateSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  durationDays: z.number().int().positive(),
  isActive: z.boolean().optional(),
});

export const planUpdateSchema = planCreateSchema.partial();
