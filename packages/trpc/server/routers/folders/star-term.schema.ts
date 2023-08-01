import { z } from "zod";

export const ZStarTermSchema = z.object({
  studySetId: z.string(),
  termId: z.string(),
});

export type TStarTermSchema = z.infer<typeof ZStarTermSchema>;
