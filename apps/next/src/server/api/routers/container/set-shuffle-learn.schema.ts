import { z } from "zod";

export const ZSetShuffleLearnSchema = z.object({
  entityId: z.string(),
  shuffleLearn: z.boolean(),
});

export type TSetShuffleLearnSchema = z.infer<typeof ZSetShuffleLearnSchema>;
