import { z } from "zod";

export const ZCreateSectionSchema = z.object({
  classId: z.string().cuid2(),
  name: z.string().nonempty().trim(),
});

export type TCreateSectionSchema = z.infer<typeof ZCreateSectionSchema>;
