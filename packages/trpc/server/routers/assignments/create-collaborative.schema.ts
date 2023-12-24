import { StudySetVisibility } from "@prisma/client";
import { z } from "zod";

import { LANGUAGE_VALUES } from "@quenti/core";

export const ZCreateCollaborativeSchema = z.object({
  classId: z.string().cuid(),
  assignmentId: z.string().cuid(),
  title: z.string(),
  description: z.string().optional(),
  visibility: z.nativeEnum(StudySetVisibility),
  classesWithAccess: z.array(z.string().cuid()).optional(),
  sectionsWithAccess: z.array(z.string().cuid()).optional(),
  wordLanguage: z.enum(LANGUAGE_VALUES),
  definitionLanguage: z.enum(LANGUAGE_VALUES),
});

export type TCreateCollaborativeSchema = z.infer<
  typeof ZCreateCollaborativeSchema
>;
