import * as z from "zod"
import * as imports from "../zod-schemas"
import { ContainerType, LearnMode, StudySetAnswerMode, MultipleAnswerMode, LimitedStudySetAnswerMode } from "@prisma/client"
import { CompleteUser, UserModel, CompleteStarredTerm, StarredTermModel, CompleteStudiableTerm, StudiableTermModel, CompleteStudySet, StudySetModel, CompleteFolder, FolderModel } from "./index"

export const _ContainerModel = z.object({
  id: z.string(),
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  userId: z.string(),
  viewedAt: z.date(),
  shuffleFlashcards: z.boolean(),
  learnRound: z.number().int(),
  learnMode: z.nativeEnum(LearnMode),
  shuffleLearn: z.boolean(),
  studyStarred: z.boolean(),
  answerWith: z.nativeEnum(StudySetAnswerMode),
  multipleAnswerMode: z.nativeEnum(MultipleAnswerMode),
  extendedFeedbackBank: z.boolean(),
  enableCardsSorting: z.boolean(),
  cardsRound: z.number().int(),
  cardsStudyStarred: z.boolean(),
  cardsAnswerWith: z.nativeEnum(LimitedStudySetAnswerMode),
  matchStudyStarred: z.boolean(),
})

export interface CompleteContainer extends z.infer<typeof _ContainerModel> {
  user: CompleteUser
  starredTerms: CompleteStarredTerm[]
  studiableTerms: CompleteStudiableTerm[]
  studySet?: CompleteStudySet | null
  folder?: CompleteFolder | null
}

/**
 * ContainerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ContainerModel: z.ZodSchema<CompleteContainer> = z.lazy(() => _ContainerModel.extend({
  user: UserModel,
  starredTerms: StarredTermModel.array(),
  studiableTerms: StudiableTermModel.array(),
  studySet: StudySetModel.nullish(),
  folder: FolderModel.nullish(),
}))
