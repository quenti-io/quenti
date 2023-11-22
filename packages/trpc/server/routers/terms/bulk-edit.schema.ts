import { z } from "zod";

export const ZBulkEditSchema = z.object({
  studySetId: z.string(),
  terms: z.array(
    z.object({
      id: z.string(),
      word: z.string(),
      definition: z.string(),
      wordRichText: z.string().optional(),
      definitionRichText: z.string().optional(),
    }),
  ),
});

export type TBulkEditSchema = z.infer<typeof ZBulkEditSchema>;
