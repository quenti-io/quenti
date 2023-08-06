import { z } from "zod";

export const ZUpdateStudentsSchema = z.object({
  classId: z.string().cuid2(),
  members: z.array(z.string().cuid2()),
  sectionId: z.string().cuid2(),
});

export type TUpdateStudentsSchema = z.infer<typeof ZUpdateStudentsSchema>;
