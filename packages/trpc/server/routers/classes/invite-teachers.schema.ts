import { z } from "zod";

export const ZInviteTeachersSchema = z.object({
  classId: z.string().cuid2(),
  emails: z.array(z.string().email()),
  sendEmail: z.boolean(),
});

export type TInviteTeachersSchema = z.infer<typeof ZInviteTeachersSchema>;
