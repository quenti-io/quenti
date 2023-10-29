import { z } from "zod";

import { LANGUAGE_VALUES } from "@quenti/core";
import { StudySetVisibility } from "@quenti/prisma/client";

export const ZSaveSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  wordLanguage: z.enum(LANGUAGE_VALUES),
  definitionLanguage: z.enum(LANGUAGE_VALUES),
  visibility: z.nativeEnum(StudySetVisibility),
  terms: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
      wordRichText: z.string().optional(),
      definitionRichText: z.string().optional(),
    }),
  ),
});

export type TSaveSchema = z.infer<typeof ZSaveSchema>;
