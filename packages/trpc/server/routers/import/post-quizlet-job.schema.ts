import { z } from "zod";

import { QUIZLET_IMPORT_REGEXP } from "@quenti/lib/constants/characters";

export const ZPostQuizletJobSchema = z.object({
  url: z.string().regex(QUIZLET_IMPORT_REGEXP),
});

export type TPostQuizletJobSchema = z.infer<typeof ZPostQuizletJobSchema>;
