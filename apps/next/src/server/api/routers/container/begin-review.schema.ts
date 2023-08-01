import { z } from "zod";

export const ZBeginReviewSchema = z.object({
  entityId: z.string(),
});

export type TBeginReviewSchema = z.infer<typeof ZBeginReviewSchema>;
