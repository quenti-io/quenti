import { z } from "zod";

import { ContainerType } from "@quenti/prisma/client";

export const ZSetEnableCardsSortingSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  enableCardsSorting: z.boolean(),
});

export type TSetEnableCardsSortingSchema = z.infer<
  typeof ZSetEnableCardsSortingSchema
>;
