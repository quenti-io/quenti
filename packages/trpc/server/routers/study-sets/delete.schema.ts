import { z } from "zod";

export const ZDeleteSchema = z.object({
  studySetId: z.string().cuid2(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
