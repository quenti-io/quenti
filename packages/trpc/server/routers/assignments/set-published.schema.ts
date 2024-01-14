import { z } from "zod";

export const ZSetPublishedSchema = z.object({
  classId: z.string().cuid(),
  id: z.string().cuid(),
  published: z.boolean(),
});

export type TSetPublishedSchema = z.infer<typeof ZSetPublishedSchema>;
