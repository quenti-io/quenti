import { z } from "zod";

export const ZGetSchema = z.object({
  id: z.string().cuid2(),
});

export type TGetSchema = z.infer<typeof ZGetSchema>;
