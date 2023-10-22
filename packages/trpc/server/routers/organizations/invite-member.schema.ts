import { z } from "zod";

import { MembershipRole } from "@quenti/prisma/client";

export const ZInviteMemberSchema = z.object({
  orgId: z.string().cuid2(),
  emails: z.array(z.string().email()).min(1).max(1000),
  role: z.nativeEnum(MembershipRole),
  sendEmail: z.boolean(),
});

export type TInviteMemberSchema = z.infer<typeof ZInviteMemberSchema>;
