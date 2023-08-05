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

  const teachers = await ctx.prisma.classMembership.findMany({
    where: {
      classId: input.id,
      type: "Teacher",
    },
    select: {
      id: true,
    },
  });

  if (input.users.includes(ctx.session.user.id) && teachers.length == 1)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot remove yourself as the only teacher in a class.",
    });

  await ctx.prisma.classMembership.deleteMany({
    where: {
      classId: input.id,
      userId: {
        in: input.users,
      },
    },
  });
};

export default removeMembersHandler;
