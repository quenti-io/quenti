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
  if (input.accept) {
    if (
      !(await ctx.prisma.organizationMembership.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      }))
    )
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "not_invited",
      });

    await ctx.prisma.organizationMembership.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        accepted: true,
      },
    });
  } else {
    await ctx.prisma.organizationMembership.delete({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }
};

export default acceptInviteHandler;
