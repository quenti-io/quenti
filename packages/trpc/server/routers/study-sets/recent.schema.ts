import { z } from "zod";

export const ZRecentSchema = z.object({
  exclude: z.array(z.string().cuid2()).optional(),
});

export type TRecentSchema = z.infer<typeof ZRecentSchema>;
