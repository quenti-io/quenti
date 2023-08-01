import * as z from "zod"
import * as imports from "../zod-schemas"

export const _WhitelistedEmailModel = z.object({
  email: z.string(),
  createdAt: z.date(),
})
