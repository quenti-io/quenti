import { MultipleAnswerMode } from "@prisma/client";
import { z } from "zod";

export const ZSetMultipleAnswerModeSchema = z.object({
  entityId: z.string(),
  multipleAnswerMode: z.nativeEnum(MultipleAnswerMode),
});

export type TSetMultipleAnswerModeSchema = z.infer<
  typeof ZSetMultipleAnswerModeSchema
>;
