import { z } from "zod";

export const ZByIdSchema = z.object({
  studySetId: z.string().cuid2(),
});

export type TByIdSchema = z.infer<typeof ZByIdSchema>;
