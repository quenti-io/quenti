import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUpdateSchema } from "./update.schema";

type UpdateOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  await isClassTeacherOrThrow(ctx.session.user.id, input.id);

  return await ctx.prisma.class.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      description: input.description,
    },
  });
};

export default updateHandler;
