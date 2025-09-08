import { z } from "zod";

export const expenseCreateSchema = z.object({
  category: z.enum(["ELECTRICITY", "WATER", "RENT", "EQUIPMENT", "MAINTENANCE", "SUPPLIES", "OTHER"]),
  amount: z.number().positive(),
  note: z.string().optional()
});

export const expenseUpdateSchema = expenseCreateSchema.partial();
