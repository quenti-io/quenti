import { z } from "zod";

export const ZUpdateSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  icon: z.number().int().min(0),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
