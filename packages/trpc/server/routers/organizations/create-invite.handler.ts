import { randomBytes } from "crypto";

import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateInviteSchema } from "./create-invite.schema";

type CreateInviteOptions = {
  ctx: NonNullableUserContext;
  input: TCreateInviteSchema;
};

export const createInviteHandler = async ({
  ctx,
  input,
}: CreateInviteOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const token = randomBytes(32).toString("hex");
  await ctx.prisma.verificationToken.create({
    data: {
      identifier: "",
      token,
      expires: new Date(),
      organizationId: input.orgId,
    },
  });

  return token;
};

export default createInviteHandler;
