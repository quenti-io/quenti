import { z } from "zod";

export const ZResetLearnProgressSchema = z.object({
  entityId: z.string(),
});

export type TResetLearnProgressSchema = z.infer<
  typeof ZResetLearnProgressSchema
>;
