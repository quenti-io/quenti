import { z } from "zod";

export const ZUploadTermImageCompleteSchema = z.object({
  submissionId: z.string().cuid2(),
  termId: z.string(),
});

export type TUploadTermImageCompleteSchema = z.infer<
  typeof ZUploadTermImageCompleteSchema
>;
