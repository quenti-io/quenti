import { TRPCError } from "@trpc/server";

import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveMembersSchema } from "./remove-members.schema";

type RemoveMembersOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveMembersSchema;
};

export const removeMembersHandler = async ({
  ctx,
  input,
}: RemoveMembersOptions) => {
  const member = await getClassMember(input.id, ctx.session.user.id);
  if (!member) throw new TRPCError({ code: "NOT_FOUND" });
  if (member.type !== "Teacher") throw new TRPCError({ code: "FORBIDDEN" });

  if (input.type == "member") {
    const teachers = await ctx.prisma.classMembership.findMany({
      where: {
        classId: input.id,
        type: "Teacher",
      },
      select: {
        id: true,
      },
    });

    const teachersLeft = teachers.filter((t) => !input.members.includes(t.id));

    if (input.members.includes(member.id) && teachersLeft.length == 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot remove yourself as the only teacher in a class.",
      });

    await ctx.prisma.classMembership.deleteMany({
      where: {
        classId: input.id,
        id: {
          in: input.members,
        },
      },
    });
  } else {
    await ctx.prisma.pendingClassInvite.deleteMany({
      where: {
        classId: input.id,
        id: {
          in: input.members,
        },
      },
    });
  }
};

export default removeMembersHandler;
