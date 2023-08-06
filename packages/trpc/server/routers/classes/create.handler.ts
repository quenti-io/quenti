import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  return await ctx.prisma.class.create({
    data: {
      name: input.name,
      description: input.description,
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
