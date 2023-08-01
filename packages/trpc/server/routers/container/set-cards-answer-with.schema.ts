import { ContainerType, LimitedStudySetAnswerMode } from "@quenti/prisma/client";
import { z } from "zod";

export const ZSetCardsAnswerWithSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  cardsAnswerWith: z.nativeEnum(LimitedStudySetAnswerMode),
});

export type TSetCardsAnswerWithSchema = z.infer<
  typeof ZSetCardsAnswerWithSchema
>;
