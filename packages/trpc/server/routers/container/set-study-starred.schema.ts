import { z } from "zod";

export const ZSetStudyStarredSchema = z.object({
  entityId: z.string(),
  studyStarred: z.boolean(),
});

export type TSetStudyStarredSchema = z.infer<typeof ZSetStudyStarredSchema>;
