import { z } from "zod";

import { ContainerType } from "@quenti/prisma/client";

export const ZSetShuffleSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  shuffle: z.boolean(),
});

export type TSetShuffleSchema = z.infer<typeof ZSetShuffleSchema>;
