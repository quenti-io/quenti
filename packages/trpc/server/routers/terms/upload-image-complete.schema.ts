import { z } from "zod";

export const ZUploadImageCompleteSchema = z.object({
  studySetId: z.string().cuid2(),
  termId: z.string(),
});

export type TUploadImageCompleteSchema = z.infer<
  typeof ZUploadImageCompleteSchema
>;
