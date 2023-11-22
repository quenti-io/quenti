import { z } from "zod";

import { LANGUAGE_VALUES } from "@quenti/core";
import { StudySetVisibility } from "@quenti/prisma/client";

import {
  MAX_CHARS_TAGS,
  MAX_DESC,
  MAX_NUM_TAGS,
  MAX_TITLE,
} from "../../common/constants";
import { profanity } from "../../common/profanity";

export const ZEditSchema = z
  .object({
    id: z.string(),
    title: z.string().trim(),
    description: z.string(),
    tags: z.array(z.string()),
    wordLanguage: z.enum(LANGUAGE_VALUES),
    definitionLanguage: z.enum(LANGUAGE_VALUES),
    visibility: z.nativeEnum(StudySetVisibility),
  })
  .transform((z) => ({
    ...z,
    title: profanity.censor(z.title.slice(0, MAX_TITLE)),
    description: profanity.censor(z.description.slice(0, MAX_DESC)),
    tags: z.tags
      .slice(0, MAX_NUM_TAGS)
      .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
  }));

export type TEditSchema = z.infer<typeof ZEditSchema>;
