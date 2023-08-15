import { z } from "zod";

import { MAX_TERM } from "../../common/constants";
import { profanity } from "../../common/profanity";

export const ZAddSchema = z
  .object({
    studySetId: z.string(),
    term: z.object({
      word: z.string(),
      rank: z.number().min(0),
      definition: z.string(),
    }),
  })
  .transform((z) => ({
    ...z,
    term: {
      ...z.term,
      word: profanity.censor(z.term.word.slice(0, MAX_TERM)),
      definition: profanity.censor(z.term.definition.slice(0, MAX_TERM)),
    },
  }));

export type TAddSchema = z.infer<typeof ZAddSchema>;
