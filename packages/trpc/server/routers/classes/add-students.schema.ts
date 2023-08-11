import { z } from "zod";

export const ZAddStudentsSchema = z.object({
  classId: z.string().cuid2(),
  emails: z.array(z.string().email()),
  sectionId: z.string().cuid2(),
});

export type TAddStudentsSchema = z.infer<typeof ZAddStudentsSchema>;
