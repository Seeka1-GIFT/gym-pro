import { z } from "zod";

export const assetCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  serialNo: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  cost: z.number().positive(),
  condition: z.enum(["good", "repair", "bad"]).default("good"),
  location: z.string().optional(),
  notes: z.string().optional()
});

export const assetUpdateSchema = assetCreateSchema.partial();


