import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteUser, UserModel, CompleteTerm, TermModel, CompleteContainer, ContainerModel } from "./index"

export const _StarredTermModel = z.object({
  userId: z.string(),
  termId: z.string(),
  containerId: z.string(),
})

export interface CompleteStarredTerm extends z.infer<typeof _StarredTermModel> {
  user: CompleteUser
  term: CompleteTerm
  container: CompleteContainer
}

/**
 * StarredTermModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StarredTermModel: z.ZodSchema<CompleteStarredTerm> = z.lazy(() => _StarredTermModel.extend({
  user: UserModel,
  term: TermModel,
  container: ContainerModel,
}))
