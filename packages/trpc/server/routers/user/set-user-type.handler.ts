import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetUserTypeSchema } from "./set-user-type.schema";

type SetUserTypeOptions = {
  ctx: NonNullableUserContext;
  input: TSetUserTypeSchema;
};

export async function setUserTypeHandler({ ctx, input }: SetUserTypeOptions) {
  const user = await ctx.prisma.user.findUniqueOrThrow({
    where: { id: ctx.session.user.id },
    select: {
      organizationId: true,
      orgMembership: {
        select: {
          id: true,
        },
      },
    },
  });

  if (user.organizationId)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot change account type if bound to an organization",
    });

  await ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: { type: input.type },
  });
}

export default setUserTypeHandler;
