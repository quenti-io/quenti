import { TRPCError } from "@trpc/server";

import { getClassMember } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TLeaveSchema } from "./leave.schema";

export type LeaveOptions = {
  ctx: NonNullableUserContext;
  input: TLeaveSchema;
};

export const leaveHandler = async ({ ctx, input }: LeaveOptions) => {
  const member = await getClassMember(input.id, ctx.session.user.id);

  if (member?.type !== "Student") throw new TRPCError({ code: "NOT_FOUND" });
  if (
    !(await ctx.prisma.class.findUnique({
      where: {
        id: member.classId,
        organization: null,
      },
      select: { id: true },
    }))
  )
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot leave organization class",
    });

  await ctx.prisma.classMembership.update({
    where: {
      id: member.id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export default leaveHandler;
