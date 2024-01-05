import { z } from "zod";

export const ZAddTermSchema = z.object({
  submissionId: z.string(),
  term: z.object({
    rank: z.number().min(0),
    word: z.string(),
    definition: z.string(),
    wordRichText: z.string().optional(),
    definitionRichText: z.string().optional(),
  }),
});

export type TAddTermSchema = z.infer<typeof ZAddTermSchema>;
