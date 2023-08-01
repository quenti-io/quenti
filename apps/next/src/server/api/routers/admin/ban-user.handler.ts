import { TRPCError } from "@trpc/server";
import { env } from "@quenti/env/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TBanUserSchema } from "./ban-user.schema";

type BanUserOptions = {
  ctx: NonNullableUserContext;
  input: TBanUserSchema;
};

export const banUserHandler = async ({ ctx, input }: BanUserOptions) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: input.userId,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User not found",
    });
  }
  if (user.email == env.ADMIN_EMAIL || user.id == ctx.session?.user?.id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Admin account cannot be banned",
    });
  }

  await ctx.prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      bannedAt: input.banned ? new Date() : null,
    },
  });
};

export default banUserHandler;
