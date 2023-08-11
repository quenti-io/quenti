import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const orgId = ctx.session.user.organizationId;
  if (!orgId)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Classes are not yet supported for personal accounts",
    });

  return await ctx.prisma.class.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      orgId,
      members: {
        create: {
          type: "Teacher",
          email: ctx.session.user.email!,
          userId: ctx.session.user.id,
        },
      },
    },
  });
};

export default createHandler;
