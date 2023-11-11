import { z } from "zod";

export const ZEditSchema = z.object({
  studySetId: z.string(),
  id: z.string(),
  word: z.string(),
  definition: z.string(),
  wordRichText: z.string().optional(),
  definitionRichText: z.string().optional(),
});

export type TEditSchema = z.infer<typeof ZEditSchema>;
