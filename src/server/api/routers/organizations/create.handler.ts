import type { NonNullableUserContext } from "../../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
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
