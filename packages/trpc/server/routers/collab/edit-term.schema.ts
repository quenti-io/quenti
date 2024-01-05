import { z } from "zod";

export const ZEditTermSchema = z.object({
  submissionId: z.string(),
  id: z.string(),
  word: z.string(),
  definition: z.string(),
  wordRichText: z.string().optional(),
  definitionRichText: z.string().optional(),
});

export type TEditTermSchema = z.infer<typeof ZEditTermSchema>;
