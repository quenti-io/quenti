import { z } from "zod";

export const ZRemoveStudentSchema = z.object({
  orgId: z.string().cuid2(),
  studentId: z.string().cuid2(),
});

export type TRemoveStudentSchema = z.infer<typeof ZRemoveStudentSchema>;
