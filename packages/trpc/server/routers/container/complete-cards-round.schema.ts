import { z } from "zod";

import { ContainerType } from "@quenti/prisma/client";

export const ZCompleteCardsRoundSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
});

export type TCompleteCardsRoundSchema = z.infer<
  typeof ZCompleteCardsRoundSchema
>;
