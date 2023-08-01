import { z } from "zod";

export const ZUnstarTermSchema = z.object({
  termId: z.string(),
});

export type TUnstarTermSchema = z.infer<typeof ZUnstarTermSchema>;
