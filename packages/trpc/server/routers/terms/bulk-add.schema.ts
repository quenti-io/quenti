import { z } from "zod";

export const ZBulkAddSchema = z.object({
  studySetId: z.string(),
  terms: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
    }),
  ),
});

export type TBulkAddSchema = z.infer<typeof ZBulkAddSchema>;
