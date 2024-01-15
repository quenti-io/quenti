import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TJoinSchema } from "./join.schema";

type JoinOptions = {
  ctx: NonNullableUserContext;
  input: TJoinSchema;
};

export const joinHandler = async ({ ctx, input }: JoinOptions) => {
  if (input.code) {
    const joinCode = await ctx.prisma.classJoinCode.findUnique({
      where: {
        code: input.code,
      },
    });

    if (!joinCode) throw new TRPCError({ code: "NOT_FOUND" });

    const membership = await ctx.prisma.classMembership.findFirst({
      where: {
        classId: joinCode.classId,
        userId: ctx.session.user.id,
        deletedAt: null,
      },
    });

    if (membership) return;

    await ctx.prisma.classMembership.upsert({
      where: {
        classId_userId: {
          classId: joinCode.classId,
          userId: ctx.session.user.id,
        },
      },
      create: {
        classId: joinCode.classId,
        userId: ctx.session.user.id,
        email: ctx.session.user.email!,
        type: "Student",
        sectionId: joinCode.sectionId,
      },
      update: {
        deletedAt: null,
        email: ctx.session.user.email!,
        sectionId: joinCode.sectionId,
      },
    });
  } else if (input.id) {
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

    await ctx.prisma.classMembership.upsert({
      where: {
        classId_userId: {
          classId: input.id,
          userId: ctx.session.user.id,
        },
      },
      create: {
        classId: input.id,
        userId: ctx.session.user.id,
        email: ctx.session.user.email!,
        type: invite.type,
        sectionId: invite.sectionId,
      },
      update: {
        deletedAt: null,
        email: ctx.session.user.email!,
        sectionId: invite.sectionId,
      },
    });
  }
};

export default joinHandler;
