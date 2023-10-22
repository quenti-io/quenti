import { z } from "zod";

export const ZDeleteSectionSchema = z.object({
  classId: z.string().cuid2(),
  sectionId: z.string().cuid2(),
});

export type TDeleteSectionSchema = z.infer<typeof ZDeleteSectionSchema>;
