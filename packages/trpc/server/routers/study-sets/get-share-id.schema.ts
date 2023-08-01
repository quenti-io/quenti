import { z } from "zod";

export const ZGetShareIdSchema = z.object({
  studySetId: z.string().cuid2(),
});

export type TGetShareIdSchema = z.infer<typeof ZGetShareIdSchema>;
