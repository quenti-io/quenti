import { z } from "zod";

export const ZSetImageSchema = z.object({
  studySetId: z.string().cuid2(),
  id: z.string(),
  query: z.string().transform((q) => q.trim().toLowerCase()),
  index: z.number().int().min(0).max(6),
});

export type TSetImageSchema = z.infer<typeof ZSetImageSchema>;
