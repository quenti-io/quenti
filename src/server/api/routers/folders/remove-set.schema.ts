import { z } from "zod";

export const ZRemoveSetSchema = z.object({
  folderId: z.string(),
  studySetId: z.string(),
});

export type TRemoveSetSchema = z.infer<typeof ZRemoveSetSchema>;
