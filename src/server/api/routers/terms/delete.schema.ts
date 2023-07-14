import { z } from "zod";

export const ZDeleteSchema = z.object({
  studySetId: z.string(),
  termId: z.string(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
