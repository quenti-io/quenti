import { z } from "zod";

export const ZRemoveTermImageSchema = z.object({
  submissionId: z.string().cuid2(),
  id: z.string(),
});

export type TRemoveTermImageSchema = z.infer<typeof ZRemoveTermImageSchema>;
