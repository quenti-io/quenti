import { z } from "zod";

export const ZNewAttemptSchema = z.object({
  studySetId: z.string().cuid(),
});

export type TNewAttemptSchema = z.infer<typeof ZNewAttemptSchema>;
