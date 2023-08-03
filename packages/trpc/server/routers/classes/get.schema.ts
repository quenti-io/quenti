import { z } from "zod";

export const ZGetSchema = z.object({
  id: z.string(),
});

export type TGetSchema = z.infer<typeof ZGetSchema>;
