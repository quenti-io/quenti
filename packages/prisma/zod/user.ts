import * as z from "zod"
import * as imports from "../zod-schemas"
import { UserType } from "@prisma/client"
import { CompleteAccount, AccountModel, CompleteSession, SessionModel, CompleteStudySet, StudySetModel, CompleteFolder, FolderModel, CompleteSetAutoSave, SetAutoSaveModel, CompleteContainer, ContainerModel, CompleteStarredTerm, StarredTermModel, CompleteStudiableTerm, StudiableTermModel, CompleteOrganization, OrganizationModel, CompleteHighscore, HighscoreModel, CompleteMembership, MembershipModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _UserModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  type: z.nativeEnum(UserType),
  verified: z.boolean(),
  createdAt: z.date(),
  lastSeenAt: z.date(),
  bannedAt: z.date().nullish(),
  displayName: z.boolean(),
  flags: z.number().int(),
  metadata: imports.userMetadataSchema,
  enableUsageData: z.boolean(),
  changelogVersion: z.string(),
  organizationId: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof _UserModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  studySets: CompleteStudySet[]
  folders: CompleteFolder[]
  setAutoSave?: CompleteSetAutoSave | null
  containers: CompleteContainer[]
  starredTerms: CompleteStarredTerm[]
  studiableTerms: CompleteStudiableTerm[]
  organization?: CompleteOrganization | null
  highscores: CompleteHighscore[]
  organizations: CompleteMembership[]
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() => _UserModel.extend({
  accounts: AccountModel.array(),
  sessions: SessionModel.array(),
  studySets: StudySetModel.array(),
  folders: FolderModel.array(),
  setAutoSave: SetAutoSaveModel.nullish(),
  containers: ContainerModel.array(),
  starredTerms: StarredTermModel.array(),
  studiableTerms: StudiableTermModel.array(),
  organization: OrganizationModel.nullish(),
  highscores: HighscoreModel.array(),
  organizations: MembershipModel.array(),
}))
