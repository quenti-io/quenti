import * as z from "zod"
import * as imports from "../zod-schemas"
import { StudySetVisibility } from "@prisma/client"
import { CompleteUser, UserModel, CompleteAutoSaveTerm, AutoSaveTermModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _SetAutoSaveModel = z.object({
  userId: z.string(),
  savedAt: z.date(),
  title: z.string(),
  description: z.string(),
  tags: jsonSchema,
  visibility: z.nativeEnum(StudySetVisibility),
  wordLanguage: z.string(),
  definitionLanguage: z.string(),
})

export interface CompleteSetAutoSave extends z.infer<typeof _SetAutoSaveModel> {
  user: CompleteUser
  autoSaveTerms: CompleteAutoSaveTerm[]
}

/**
 * SetAutoSaveModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const SetAutoSaveModel: z.ZodSchema<CompleteSetAutoSave> = z.lazy(() => _SetAutoSaveModel.extend({
  user: UserModel,
  autoSaveTerms: AutoSaveTermModel.array(),
}))
