import { z } from "zod";

export const ZUpdateSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  clearLogo: z.boolean().optional(),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
