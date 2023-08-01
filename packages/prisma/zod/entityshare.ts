import * as z from "zod"
import * as imports from "../zod-schemas"
import { EntityType } from "@prisma/client"

export const _EntityShareModel = z.object({
  id: z.string(),
  entityId: z.string(),
  type: z.nativeEnum(EntityType),
})
