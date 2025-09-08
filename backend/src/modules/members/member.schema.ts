import { z } from "zod";

export const memberCreateSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().datetime().optional(),
  photoUrl: z.string().url().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export const memberUpdateSchema = memberCreateSchema.partial();
