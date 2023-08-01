import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteVerifiedOrganizationDomain, VerifiedOrganizationDomainModel, CompleteMembership, MembershipModel, CompleteUser, UserModel, CompleteVerificationToken, VerificationTokenModel, CompletePendingInvite, PendingInviteModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _OrganizationModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  icon: z.number().int(),
  published: z.boolean(),
  metadata: imports.orgMetadataSchema,
})

export interface CompleteOrganization extends z.infer<typeof _OrganizationModel> {
  domain?: CompleteVerifiedOrganizationDomain | null
  members: CompleteMembership[]
  users: CompleteUser[]
  inviteToken?: CompleteVerificationToken | null
  pendingInvites: CompletePendingInvite[]
}

/**
 * OrganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const OrganizationModel: z.ZodSchema<CompleteOrganization> = z.lazy(() => _OrganizationModel.extend({
  domain: VerifiedOrganizationDomainModel.nullish(),
  members: MembershipModel.array(),
  users: UserModel.array(),
  inviteToken: VerificationTokenModel.nullish(),
  pendingInvites: PendingInviteModel.array(),
}))
