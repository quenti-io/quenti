import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TAcceptInviteSchema } from "./accept-invite.schema";

type AcceptInviteOptions = {
  ctx: NonNullableUserContext;
  input: TAcceptInviteSchema;
};

export const acceptInviteHandler = async ({
  ctx,
  input,
}: AcceptInviteOptions) => {
  const invite = await ctx.prisma.pendingOrganizationInvite.findFirst({
    where: {
      orgId: input.orgId,
      email: ctx.session.user.email!,
    },
  });
  if (!invite)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "not_invited",
    });

  await ctx.prisma.pendingOrganizationInvite.delete({
    where: {
      id: invite.id,
    },
  });

  if (input.accept) {
    await ctx.prisma.organizationMembership.create({
      data: {
        orgId: input.orgId,
        userId: ctx.session.user.id,
        role: invite.role,
      },
    });
  }
};

export default acceptInviteHandler;
