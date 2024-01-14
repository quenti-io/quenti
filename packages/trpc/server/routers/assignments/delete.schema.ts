import { z } from "zod";

export const ZDeleteAssignmentSchema = z.object({
  classId: z.string().cuid(),
  id: z.string().cuid(),
});

export type TDeleteAssignmentSchema = z.infer<typeof ZDeleteAssignmentSchema>;
