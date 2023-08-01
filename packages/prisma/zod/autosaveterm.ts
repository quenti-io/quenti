import * as z from "zod"
import * as imports from "../zod-schemas"
import { CompleteSetAutoSave, SetAutoSaveModel } from "./index"

export const _AutoSaveTermModel = z.object({
  id: z.string(),
  word: z.string(),
  definition: z.string(),
  rank: z.number().int(),
  setAutoSaveId: z.string(),
})

export interface CompleteAutoSaveTerm extends z.infer<typeof _AutoSaveTermModel> {
  setAutoSave: CompleteSetAutoSave
}

/**
 * AutoSaveTermModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AutoSaveTermModel: z.ZodSchema<CompleteAutoSaveTerm> = z.lazy(() => _AutoSaveTermModel.extend({
  setAutoSave: SetAutoSaveModel,
}))
