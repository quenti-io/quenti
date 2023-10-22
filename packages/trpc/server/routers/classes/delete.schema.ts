import { z } from "zod";

export const ZDeleteSchema = z.object({
  id: z.string().cuid2(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
