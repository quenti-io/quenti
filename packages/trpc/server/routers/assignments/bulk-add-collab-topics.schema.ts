import { z } from "zod";

export const ZBulkAddCollabTopicsSchema = z.object({
  collabId: z.string().cuid(),
  topics: z.array(
    z.object({
      topic: z.string(),
      description: z.string().optional(),
      minTerms: z.number().int().min(1).max(50),
      maxTerms: z.number().int().min(1).max(50),
    }),
  ),
});

export type TBulkAddCollabTopicsSchema = z.infer<
  typeof ZBulkAddCollabTopicsSchema
>;
