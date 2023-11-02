import { env } from "@quenti/env/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";

type DeleteAccountOptions = {
  ctx: NonNullableUserContext;
};

export const deleteAccountHandler = async ({ ctx }: DeleteAccountOptions) => {
  ctx.req.log.debug("user.deleteAccount");

  const orgMembership = await ctx.prisma.organizationMembership.findUnique({
    where: {
      userId: ctx.session.user.id,
    },
  });
  if (orgMembership) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "You are currently a member of an organization. Leave the organization first before deleting your account.",
    });
  }

  await ctx.prisma.user.delete({
    where: {
      id: ctx.session.user.id,
    },
  });
};

export default deleteAccountHandler;
