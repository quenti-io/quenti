import { z } from "zod";
import { profanity } from "../../common/profanity";
import { MAX_TERM } from "../../common/constants";

export const ZEditSchema = z
  .object({
    studySetId: z.string(),
    id: z.string(),
    word: z.string(),
    definition: z.string(),
  })
  .transform((z) => ({
    ...z,
    word: profanity.censor(z.word.slice(0, MAX_TERM)),
    definition: profanity.censor(z.definition.slice(0, MAX_TERM)),
  }));

export type TEditSchema = z.infer<typeof ZEditSchema>;
