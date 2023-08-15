import { z } from "zod";

import { EntityType } from "@quenti/prisma/client";

export const ZRemoveEntitySchema = z.object({
  classId: z.string().cuid2(),
  type: z.nativeEnum(EntityType),
  entityId: z.string().cuid2(),
});

export type TRemoveEntitySchema = z.infer<typeof ZRemoveEntitySchema>;
