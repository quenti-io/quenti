import { z } from "zod";

export const ZRecentForSetAddSchema = z.object({
  studySetId: z.string().cuid2(),
});

export type TRecentForSetAddSchema = z.infer<typeof ZRecentForSetAddSchema>;
