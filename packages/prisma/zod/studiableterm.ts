import * as z from "zod"
import * as imports from "../zod-schemas"
import { StudiableMode } from "@prisma/client"
import { CompleteUser, UserModel, CompleteTerm, TermModel, CompleteContainer, ContainerModel } from "./index"

export const _StudiableTermModel = z.object({
  userId: z.string(),
  termId: z.string(),
  containerId: z.string(),
  mode: z.nativeEnum(StudiableMode),
  correctness: z.number().int(),
  appearedInRound: z.number().int().nullish(),
  incorrectCount: z.number().int(),
  studiableRank: z.number().int().nullish(),
})

export interface CompleteStudiableTerm extends z.infer<typeof _StudiableTermModel> {
  user: CompleteUser
  term: CompleteTerm
  container: CompleteContainer
}

/**
 * StudiableTermModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StudiableTermModel: z.ZodSchema<CompleteStudiableTerm> = z.lazy(() => _StudiableTermModel.extend({
  user: UserModel,
  term: TermModel,
  container: ContainerModel,
}))
