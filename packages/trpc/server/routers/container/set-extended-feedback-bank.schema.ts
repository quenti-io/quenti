import { z } from "zod";

export const ZSetExtendedFeedbackBankSchema = z.object({
  entityId: z.string(),
  extendedFeedbackBank: z.boolean(),
});

export type TSetExtendedFeedbackBankSchema = z.infer<
  typeof ZSetExtendedFeedbackBankSchema
>;
