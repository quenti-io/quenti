import { ContainerType } from "@prisma/client";
import { z } from "zod";

export const ZSetShuffleSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  shuffle: z.boolean(),
});

export type TSetShuffleSchema = z.infer<typeof ZSetShuffleSchema>;
