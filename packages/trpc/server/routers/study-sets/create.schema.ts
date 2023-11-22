import { z } from "zod";

export const ZCreateSchema = z.object({
  id: z.string().cuid2(),
});

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
