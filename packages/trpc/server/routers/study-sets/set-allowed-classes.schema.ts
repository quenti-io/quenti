import { z } from "zod";

export const ZSetAllowedClassesSchema = z.object({
  studySetId: z.string().cuid(),
  classIds: z.array(z.string().cuid()),
});

export type TSetAllowedClassesSchema = z.infer<typeof ZSetAllowedClassesSchema>;
