import { MembershipRole } from "@prisma/client";
import { z } from "zod";

export const ZEditMemberRoleSchema = z.object({
  orgId: z.string().cuid2(),
  userId: z.string().cuid2(),
  role: z.nativeEnum(MembershipRole),
});

export type TEditMemberRoleSchema = z.infer<typeof ZEditMemberRoleSchema>;
