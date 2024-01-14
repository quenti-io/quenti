import { z } from "zod";

export const ZByIdSchema = z.object({
  studySetId: z.string().cuid2(),
  withDistractors: z.boolean().optional(),
  withCollab: z.boolean().optional(),
});

export type TByIdSchema = z.infer<typeof ZByIdSchema>;
