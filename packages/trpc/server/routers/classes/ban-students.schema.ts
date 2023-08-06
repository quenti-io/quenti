import { z } from "zod";

export const ZBanStudentsSchema = z.object({
  classId: z.string().cuid2(),
  users: z.array(z.string().cuid2()),
});

export type TBanStudentsSchema = z.infer<typeof ZBanStudentsSchema>;
