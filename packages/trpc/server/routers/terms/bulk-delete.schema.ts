import { z } from "zod";

export const ZBulkDeleteSchema = z
  .object({
    studySetId: z.string(),
    terms: z.array(z.string().cuid2()),
  })
  .transform((data) => ({
    ...data,
    terms: data.terms.slice(0, 100),
  }));

export type TBulkDeleteSchema = z.infer<typeof ZBulkDeleteSchema>;
