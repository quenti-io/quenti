import * as z from "zod"
import * as imports from "../zod-schemas"

export const _AllowedEmailRegexModel = z.object({
  regex: z.string(),
  label: z.string(),
  createdAt: z.date(),
})
