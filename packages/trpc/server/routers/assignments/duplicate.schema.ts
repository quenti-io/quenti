import { z } from "zod";

export const ZDuplicateSchema = z.object({
  classId: z.string().cuid(),
  id: z.string().cuid(),
  sectionIds: z.array(z.string().cuid()),
});

export type TDuplicateSchema = z.infer<typeof ZDuplicateSchema>;
