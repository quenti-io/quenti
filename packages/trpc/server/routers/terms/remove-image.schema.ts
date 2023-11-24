import { z } from "zod";

export const ZRemoveImageSchema = z.object({
  studySetId: z.string().cuid2(),
  id: z.string(),
});

export type TRemoveImageSchema = z.infer<typeof ZRemoveImageSchema>;
