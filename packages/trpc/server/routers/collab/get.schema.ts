import { z } from "zod";

export const ZGetSchema = z.object({
  studySetId: z.string().cuid(),
});

export type TGetSchema = z.infer<typeof ZGetSchema>;
