import type { NonNullableUserContext } from "../../../lib/types";
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
    await ctx.prisma.membership.update({
      where: {
        userId_orgId: {
          userId: ctx.session.user.id,
          orgId: input.orgId,
        },
      },
      data: {
        accepted: true,
      },
    });
  } else {
    await ctx.prisma.membership.delete({
      where: {
        userId_orgId: {
          userId: ctx.session.user.id,
          orgId: input.orgId,
        },
      },
    });
  }
};

export default acceptInviteHandler;
