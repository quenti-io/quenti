import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteUser, UserModel, CompleteStudySetsOnFolders, StudySetsOnFoldersModel, CompleteContainer, ContainerModel, CompleteLeaderboard, LeaderboardModel } from "./index"

export const _FolderModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  userId: z.string(),
  title: z.string(),
  slug: z.string().nullish(),
  description: z.string(),
})

export interface CompleteFolder extends z.infer<typeof _FolderModel> {
  user: CompleteUser
  studySets: CompleteStudySetsOnFolders[]
  containers: CompleteContainer[]
  leaderboards: CompleteLeaderboard[]
}

/**
 * FolderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const FolderModel: z.ZodSchema<CompleteFolder> = z.lazy(() => _FolderModel.extend({
  user: UserModel,
  studySets: StudySetsOnFoldersModel.array(),
  containers: ContainerModel.array(),
  leaderboards: LeaderboardModel.array(),
}))
