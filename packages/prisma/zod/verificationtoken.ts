import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteOrganization, OrganizationModel } from "./index"

export const _VerificationTokenModel = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
  expiresInDays: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.string().nullish(),
})

export interface CompleteVerificationToken extends z.infer<typeof _VerificationTokenModel> {
  organization?: CompleteOrganization | null
}

/**
 * VerificationTokenModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const VerificationTokenModel: z.ZodSchema<CompleteVerificationToken> = z.lazy(() => _VerificationTokenModel.extend({
  organization: OrganizationModel.nullish(),
}))
