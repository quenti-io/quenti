import { z } from "zod";

export const ZUpdateSectionSchema = z.object({
  classId: z.string().cuid2(),
  sectionId: z.string().cuid2(),
  name: z.string().trim().nonempty(),
});

export type TUpdateSectionSchema = z.infer<typeof ZUpdateSectionSchema>;
