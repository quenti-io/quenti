import { z } from "zod";

export const ZGetPublicSchema = z.object({
  studySetId: z.string().cuid2(),
  withCollab: z.boolean().optional(),
});

export type TGetPublicSchema = z.infer<typeof ZGetPublicSchema>;
