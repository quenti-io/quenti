import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteOrganization, OrganizationModel } from "./index"

export const _VerifiedOrganizationDomainModel = z.object({
  id: z.string(),
  orgId: z.string(),
  requestedDomain: z.string(),
  domain: z.string().nullish(),
  verifiedEmail: z.string(),
  otpHash: z.string().nullish(),
  verifiedAt: z.date().nullish(),
})

export interface CompleteVerifiedOrganizationDomain extends z.infer<typeof _VerifiedOrganizationDomainModel> {
  organization: CompleteOrganization
}

/**
 * VerifiedOrganizationDomainModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const VerifiedOrganizationDomainModel: z.ZodSchema<CompleteVerifiedOrganizationDomain> = z.lazy(() => _VerifiedOrganizationDomainModel.extend({
  organization: OrganizationModel,
}))
