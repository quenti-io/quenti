import { z } from "zod";

import {
  ContainerType,
  LimitedStudySetAnswerMode,
} from "@quenti/prisma/client";

export const ZSetCardsAnswerWithSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  cardsAnswerWith: z.nativeEnum(LimitedStudySetAnswerMode),
});

export type TSetCardsAnswerWithSchema = z.infer<
  typeof ZSetCardsAnswerWithSchema
>;
