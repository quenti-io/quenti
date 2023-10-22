import { z } from "zod";

export const ZInviteTeachersSchema = z.object({
  orgId: z.string().cuid2(),
  emails: z.array(z.string().email()).min(1).max(1000),
});

export type TInviteTeachersSchema = z.infer<typeof ZInviteTeachersSchema>;
