import { z } from "zod";

import { MAX_DESC, MAX_TITLE } from "../../common/constants";
import { profanity } from "../../common/profanity";

export const ZEditSchema = z
  .object({
    folderId: z.string(),
    title: z.string().trim().min(1),
    description: z.string(),
  })
  .transform((z) => ({
    ...z,
    title: profanity.censor(z.title.slice(0, MAX_TITLE)),
    description: profanity.censor(z.description.slice(0, MAX_DESC)),
  }));

export type TEditSchema = z.infer<typeof ZEditSchema>;
