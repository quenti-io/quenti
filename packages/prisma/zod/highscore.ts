import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteUser, UserModel, CompleteLeaderboard, LeaderboardModel } from "./index"

export const _HighscoreModel = z.object({
  leaderboardId: z.string(),
  userId: z.string(),
  time: z.number().int(),
  timestamp: z.date(),
  eligible: z.boolean(),
})

export interface CompleteHighscore extends z.infer<typeof _HighscoreModel> {
  user: CompleteUser
  leaderboard: CompleteLeaderboard
}

/**
 * HighscoreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const HighscoreModel: z.ZodSchema<CompleteHighscore> = z.lazy(() => _HighscoreModel.extend({
  user: UserModel,
  leaderboard: LeaderboardModel,
}))
