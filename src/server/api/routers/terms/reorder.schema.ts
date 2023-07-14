import { z } from "zod";

export const ZReorderSchema = z.object({
  studySetId: z.string(),
  term: z.object({
    id: z.string(),
    rank: z.number().min(0),
  }),
});

export type TReorderSchema = z.infer<typeof ZReorderSchema>;
