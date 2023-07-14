import { z } from "zod";

export const ZGetSchema = z.object({
  slug: z.string(),
});

export type TGetSchema = z.infer<typeof ZGetSchema>;
