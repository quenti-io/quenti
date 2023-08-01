import * as z from "zod"
import * as imports from "../zod-schemas"

export const _RecentFailedLoginModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  image: z.string().nullish(),
  createdAt: z.date(),
})
