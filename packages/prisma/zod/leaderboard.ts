import * as z from "zod"
import * as imports from "../zod-schemas"
import { LeaderboardType } from "@prisma/client"
import { CompleteStudySet, StudySetModel, CompleteFolder, FolderModel, CompleteHighscore, HighscoreModel } from "./index"

export const _LeaderboardModel = z.object({
  id: z.string(),
  entityId: z.string(),
  type: z.nativeEnum(LeaderboardType),
})

export interface CompleteLeaderboard extends z.infer<typeof _LeaderboardModel> {
  studySet?: CompleteStudySet | null
  folder?: CompleteFolder | null
  highscores: CompleteHighscore[]
}

/**
 * LeaderboardModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const LeaderboardModel: z.ZodSchema<CompleteLeaderboard> = z.lazy(() => _LeaderboardModel.extend({
  studySet: StudySetModel.nullish(),
  folder: FolderModel.nullish(),
  highscores: HighscoreModel.array(),
}))
