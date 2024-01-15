import { z } from "zod";

export const ZSubmitSchema = z.object({
  submissionId: z.string().cuid(),
});

export type TSubmitSchema = z.infer<typeof ZSubmitSchema>;
