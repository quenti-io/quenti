import { TRPCError } from "@trpc/server";

import {
  getClassMember,
  getClassOrganizationMember,
} from "../../lib/queries/classes";
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

  if (member?.type !== "Teacher") {
    const orgMember = await getClassOrganizationMember(
      input.id,
      ctx.session.user.id,
    );
    if (!(orgMember?.role === "Owner" || orgMember?.role === "Admin"))
      throw new TRPCError({ code: "FORBIDDEN" });
  }

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

    if (member && input.members.includes(member.id) && teachersLeft.length == 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot remove yourself as the only teacher in a class.",
      });

    await ctx.prisma.classMembership.updateMany({
      where: {
        classId: input.id,
        id: {
          in: input.members,
        },
      },
      data: {
        deletedAt: new Date(),
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
