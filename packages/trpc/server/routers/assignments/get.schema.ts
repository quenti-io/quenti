import { z } from "zod";

export const ZGetSchema = z.object({
  classId: z.string().cuid(),
  id: z.string().cuid(),
});

export type TGetSchema = z.infer<typeof ZGetSchema>;
