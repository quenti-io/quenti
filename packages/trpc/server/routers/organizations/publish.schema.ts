import { z } from "zod";

export const ZPublishSchema = z.object({
  orgId: z.string(),
});

export type TPublishSchema = z.infer<typeof ZPublishSchema>;
