import { z } from "zod";

export const ZSetEnableUsageDataSchema = z.object({
  enableUsageData: z.boolean(),
});

export type TSetEnableUsageDataSchema = z.infer<typeof ZSetEnableUsageDataSchema>;
