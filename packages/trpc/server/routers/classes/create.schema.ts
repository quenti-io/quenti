import { z } from "zod";

export const ZCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().trim().nullish(),
});

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
