import * as z from "zod"
import * as imports from "../zod-schemas"
import { MembershipRole } from "@prisma/client"
import { CompleteOrganization, OrganizationModel, CompleteUser, UserModel } from "./index"

export const _MembershipModel = z.object({
  id: z.string(),
  orgId: z.string(),
  userId: z.string(),
  accepted: z.boolean(),
  role: z.nativeEnum(MembershipRole),
})

export interface CompleteMembership extends z.infer<typeof _MembershipModel> {
  organization: CompleteOrganization
  user: CompleteUser
}

/**
 * MembershipModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const MembershipModel: z.ZodSchema<CompleteMembership> = z.lazy(() => _MembershipModel.extend({
  organization: OrganizationModel,
  user: UserModel,
}))
