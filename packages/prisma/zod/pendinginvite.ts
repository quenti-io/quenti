import * as z from "zod"
import * as imports from "../zod-schemas"
import { MembershipRole } from "@prisma/client"
import { CompleteOrganization, OrganizationModel } from "./index"

export const _PendingInviteModel = z.object({
  id: z.string(),
  orgId: z.string(),
  email: z.string(),
  role: z.nativeEnum(MembershipRole),
})

export interface CompletePendingInvite extends z.infer<typeof _PendingInviteModel> {
  organization: CompleteOrganization
}

/**
 * PendingInviteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PendingInviteModel: z.ZodSchema<CompletePendingInvite> = z.lazy(() => _PendingInviteModel.extend({
  organization: OrganizationModel,
}))
