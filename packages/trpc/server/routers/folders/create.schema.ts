import { z } from "zod";

import { MAX_DESC, MAX_TITLE } from "../../common/constants";
import { profanity } from "../../common/profanity";

export const ZCreateSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string(),
    setId: z.string().optional(),
  })
  .transform((z) => ({
    ...z,
    title: profanity.censor(z.title.slice(0, MAX_TITLE)),
    description: profanity.censor(z.description.slice(MAX_DESC)),
  }));

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
