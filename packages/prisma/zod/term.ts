import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteStudySet, StudySetModel, CompleteStarredTerm, StarredTermModel, CompleteStudiableTerm, StudiableTermModel } from "./index"

export const _TermModel = z.object({
  id: z.string(),
  word: z.string(),
  definition: z.string(),
  rank: z.number().int(),
  studySetId: z.string(),
})

export interface CompleteTerm extends z.infer<typeof _TermModel> {
  StudySet: CompleteStudySet
  starredTerms: CompleteStarredTerm[]
  studiableTerms: CompleteStudiableTerm[]
}

/**
 * TermModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const TermModel: z.ZodSchema<CompleteTerm> = z.lazy(() => _TermModel.extend({
  StudySet: StudySetModel,
  starredTerms: StarredTermModel.array(),
  studiableTerms: StudiableTermModel.array(),
}))
