import { z } from "zod";

export const ZRemoveMemberSchema = z.object({
  orgId: z.string().cuid2(),
  genericId: z.string().cuid2(),
  type: z.enum(["user", "invite"]),
});

export type TRemoveMemberSchema = z.infer<typeof ZRemoveMemberSchema>;
