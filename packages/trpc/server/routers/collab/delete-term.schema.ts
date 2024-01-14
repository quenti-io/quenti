import { z } from "zod";

export const ZDeleteTermSchema = z.object({
  submissionId: z.string(),
  termId: z.string(),
});

export type TDeleteTermSchema = z.infer<typeof ZDeleteTermSchema>;
