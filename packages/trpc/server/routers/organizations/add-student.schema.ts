import { z } from "zod";

export const ZAddStudentSchema = z.object({
  orgId: z.string().cuid2(),
  email: z.string().email(),
});

export type TAddStudentSchema = z.infer<typeof ZAddStudentSchema>;
