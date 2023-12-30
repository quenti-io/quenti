import { z } from "zod";

export const ZFeedSchema = z.object({
  classId: z.string().cuid(),
  sectionId: z.string().cuid().nullish(),
  query: z.string().nullish(),
});

export type TFeedSchema = z.infer<typeof ZFeedSchema>;
