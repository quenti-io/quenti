import { z } from "zod";

export const ZReorderTermSchema = z.object({
  submissionId: z.string(),
  term: z.object({
    id: z.string(),
    rank: z.number().min(0),
  }),
});

export type TReorderTermSchema = z.infer<typeof ZReorderTermSchema>;
