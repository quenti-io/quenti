import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteStudySet, StudySetModel, CompleteFolder, FolderModel } from "./index"

export const _StudySetsOnFoldersModel = z.object({
  studySetId: z.string(),
  folderId: z.string(),
})

export interface CompleteStudySetsOnFolders extends z.infer<typeof _StudySetsOnFoldersModel> {
  studySet: CompleteStudySet
  folder: CompleteFolder
}

/**
 * StudySetsOnFoldersModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StudySetsOnFoldersModel: z.ZodSchema<CompleteStudySetsOnFolders> = z.lazy(() => _StudySetsOnFoldersModel.extend({
  studySet: StudySetModel,
  folder: FolderModel,
}))
