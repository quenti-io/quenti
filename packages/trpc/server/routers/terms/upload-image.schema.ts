import { z } from "zod";

export const ZUploadImageSchema = z.object({
  studySetId: z.string().cuid2(),
  termId: z.string().cuid2(),
});

export type TUploadImageSchema = z.infer<typeof ZUploadImageSchema>;
