import { ContainerType } from "@quenti/prisma/client";
import { z } from "zod";

export const ZResetCardsProgressSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
});

export type TResetCardsProgressSchema = z.infer<
  typeof ZResetCardsProgressSchema
>;
