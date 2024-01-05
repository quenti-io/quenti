import { z } from "zod";

export const ZUploadTermImageSchema = z.object({
  submissionId: z.string().cuid2(),
  termId: z.string(),
});

export type TUploadTermImageSchema = z.infer<typeof ZUploadTermImageSchema>;
