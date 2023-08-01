import * as z from "zod"
import * as imports from "../zod-schemas"
import { StudySetVisibility } from "@prisma/client"
import { CompleteUser, UserModel, CompleteTerm, TermModel, CompleteContainer, ContainerModel, CompleteStudySetsOnFolders, StudySetsOnFoldersModel, CompleteLeaderboard, LeaderboardModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _StudySetModel = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  savedAt: z.date(),
  title: z.string(),
  description: z.string(),
  tags: jsonSchema,
  visibility: z.nativeEnum(StudySetVisibility),
  wordLanguage: z.string(),
  definitionLanguage: z.string(),
})

export interface CompleteStudySet extends z.infer<typeof _StudySetModel> {
  user: CompleteUser
  terms: CompleteTerm[]
  containers: CompleteContainer[]
  folders: CompleteStudySetsOnFolders[]
  leaderboards: CompleteLeaderboard[]
}

/**
 * StudySetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StudySetModel: z.ZodSchema<CompleteStudySet> = z.lazy(() => _StudySetModel.extend({
  user: UserModel,
  terms: TermModel.array(),
  containers: ContainerModel.array(),
  folders: StudySetsOnFoldersModel.array(),
  leaderboards: LeaderboardModel.array(),
}))
