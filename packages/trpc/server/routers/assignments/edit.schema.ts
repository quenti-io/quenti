import { z } from "zod";

export const ZEditSchema = z.object({
  classId: z.string().cuid(),
  id: z.string().cuid(),
  sectionId: z.string().cuid().nullable(),
  title: z.string(),
  description: z.string().optional(),
  availableAt: z.coerce.date(),
  dueAt: z.coerce.date().optional().nullable(),
  lockedAt: z.coerce.date().optional().nullable(),
});

export type TEditSchema = z.infer<typeof ZEditSchema>;
