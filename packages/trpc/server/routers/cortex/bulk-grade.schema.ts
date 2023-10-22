import { z } from "zod";

export const ZBulkGradeSchema = z.object({
  answers: z.array(
    z.object({
      index: z.number().int().min(0),
      answer: z.string(),
      input: z.string(),
    }),
  ),
});

export type TBulkGradeSchema = z.infer<typeof ZBulkGradeSchema>;
