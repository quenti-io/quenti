import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import { profanity } from "../../common/profanity";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  if (profanity.exists(input.name))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "name_profane",
    });

  return await ctx.prisma.organization.create({
    data: {
      name: input.name,
      icon: input.icon,
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
