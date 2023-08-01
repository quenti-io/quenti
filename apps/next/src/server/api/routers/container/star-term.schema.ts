import { z } from "zod";

export const ZStarTermSchema = z.object({
  containerId: z.string(),
  termId: z.string(),
});

export type TStarTermSchema = z.infer<typeof ZStarTermSchema>;
