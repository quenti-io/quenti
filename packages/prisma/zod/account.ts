import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteUser, UserModel } from "./index"

export const _AccountModel = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullish(),
  access_token: z.string().nullish(),
  expires_at: z.number().int().nullish(),
  token_type: z.string().nullish(),
  scope: z.string().nullish(),
  id_token: z.string().nullish(),
  session_state: z.string().nullish(),
})

export interface CompleteAccount extends z.infer<typeof _AccountModel> {
  user: CompleteUser
}

/**
 * AccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() => _AccountModel.extend({
  user: UserModel,
}))
