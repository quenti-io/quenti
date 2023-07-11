import { ContainerType } from "@prisma/client";
import { z } from "zod";

export const ZSetEnableCardsSortingSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  enableCardsSorting: z.boolean(),
});

export type TSetEnableCardsSortingSchema = z.infer<
  typeof ZSetEnableCardsSortingSchema
>;
