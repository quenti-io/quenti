import { ContainerType } from "@quenti/prisma/client";
import { z } from "zod";

export const ZCompleteCardsRoundSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
});

export type TCompleteCardsRoundSchema = z.infer<
  typeof ZCompleteCardsRoundSchema
>;
