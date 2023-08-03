import { z } from "zod";
import { profanity } from "../../common/profanity";

export const ZCreateSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string(),
  })
  .transform((z) => ({
    ...z,
    name: profanity.censor(z.name),
    description: profanity.censor(z.description),
  }));

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
