import { z } from "zod";

export const ZCompleteLearnRoundSchema = z.object({
  entityId: z.string(),
});

export type TCompleteLearnRoundSchema = z.infer<
  typeof ZCompleteLearnRoundSchema
>;
