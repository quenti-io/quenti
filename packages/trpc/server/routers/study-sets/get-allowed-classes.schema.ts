import { z } from "zod";

export const ZGetAllowedClassesSchema = z.object({
  studySetId: z.string().cuid(),
});

export type TGetAllowedClassesSchema = z.infer<typeof ZGetAllowedClassesSchema>;
