import { z } from "zod";

import { QUIZLET_IMPORT_REGEXP } from "@quenti/lib/constants/characters";

export const ZFromUrlSchema = z.object({
  url: z.string().url().regex(QUIZLET_IMPORT_REGEXP),
});

export type TFromUrlSchema = z.infer<typeof ZFromUrlSchema>;
