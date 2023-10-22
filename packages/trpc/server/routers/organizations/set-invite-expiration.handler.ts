import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TSetInviteExpirationSchema } from "./set-invite-expiration.schema";

type SetInviteExpirationHandler = {
  ctx: NonNullableUserContext;
  input: TSetInviteExpirationSchema;
};

export const setInviteExpirationHandler = async ({
  ctx,
  input,
}: SetInviteExpirationHandler) => {
  const token = await ctx.prisma.verificationToken.findFirst({
    where: {
      token: input.token,
    },
    select: {
      organizationId: true,
    },
  });

  if (!token) throw new TRPCError({ code: "NOT_FOUND" });
  if (
    !token.organizationId ||
    !(await isOrganizationAdmin(ctx.session.user.id, token.organizationId))
  )
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const oneDay = 1000 * 60 * 60 * 24;
  const expires = new Date(Date.now() + (input.expiresInDays ?? 0) * oneDay);

  await ctx.prisma.verificationToken.update({
    where: {
      token: input.token,
    },
    data: {
      expires,
      expiresInDays: input.expiresInDays,
    },
  });
};

export default setInviteExpirationHandler;
