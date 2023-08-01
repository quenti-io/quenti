import { MembershipRole } from "@quenti/prisma/client";
import { z } from "zod";

export const ZEditMemberRoleSchema = z.object({
  orgId: z.string().cuid2(),
  genericId: z.string().cuid2(),
  type: z.enum(["user", "invite"]),
  role: z.nativeEnum(MembershipRole),
});

export type TEditMemberRoleSchema = z.infer<typeof ZEditMemberRoleSchema>;
