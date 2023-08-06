import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TJoinSchema } from "./join.schema";

type JoinOptions = {
  ctx: NonNullableUserContext;
  input: TJoinSchema;
};

export const joinHandler = async ({ ctx, input }: JoinOptions) => {
  if (input.code) {
    throw new Error("Not implemented");
  } else if (input.id) {
    console.log(ctx.session.user.email);
    const invite = await ctx.prisma.pendingClassInvite.findUnique({
      where: {
        classId_email: {
          classId: input.id,
          email: ctx.session.user.email!,
        },
      },
    });

    if (!invite) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.pendingClassInvite.delete({
      where: {
        id: invite.id,
      },
    });
    console.log(ctx.session.user.id, ctx.session.user.email!);

    await ctx.prisma.classMembership.create({
      data: {
        classId: input.id,
        userId: ctx.session.user.id,
        email: ctx.session.user.email!,
        type: "Teacher",
      },
    });
  }
};

export default joinHandler;
