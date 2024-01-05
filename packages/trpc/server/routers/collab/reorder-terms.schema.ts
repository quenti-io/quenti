import { z } from "zod";

export const ZReorderTermsSchema = z.object({
  submissionId: z.string(),
  term: z.object({
    id: z.string(),
    rank: z.number().min(0),
  }),
});

export type TReorderTermsSchema = z.infer<typeof ZReorderTermsSchema>;
