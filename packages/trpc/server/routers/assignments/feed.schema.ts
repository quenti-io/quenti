import { z } from "zod";

export const ZFeedSchema = z.object({
  classId: z.string().cuid(),
});

export type TFeedSchema = z.infer<typeof ZFeedSchema>;
