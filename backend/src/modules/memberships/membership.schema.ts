import { z } from "zod";

export const membershipCreateSchema = z.object({
  memberId: z.string().min(1),
  planId: z.string().min(1),
  startDate: z.string().datetime()
});

export const membershipPatchSchema = z.object({
  action: z.enum(["pause", "resume", "expire"])
});
