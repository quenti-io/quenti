import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const existing = await ctx.prisma.organization.findUnique({
    where: {
      slug: input.slug,
    },
  });

  if (existing)
    throw new TRPCError({
      code: "CONFLICT",
      message: "slug_conflict",
    });

  return await ctx.prisma.organization.create({
    data: {
      name: input.name,
      slug: input.slug,
      members: {
        create: {
          userId: ctx.session.user.id,
          role: "Owner",
          accepted: true,
        },
      },
    },
  });
};

export default createHandler;
