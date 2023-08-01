import { z } from "zod";

export const ZAddSetsSchema = z.object({
  folderId: z.string(),
  studySetIds: z.array(z.string().cuid2()).max(16),
});

export type TAddSetsSchema = z.infer<typeof ZAddSetsSchema>;
