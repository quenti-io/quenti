import { StudySetAnswerMode } from "@prisma/client";
import { z } from "zod";

export const ZSetAnswerModeSchema = z.object({
  entityId: z.string(),
  answerWith: z.nativeEnum(StudySetAnswerMode),
});

export type TSetAnswerModeSchema = z.infer<typeof ZSetAnswerModeSchema>;
