import type { NonNullableUserContext } from "../../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  return await ctx.prisma.studySet.delete({
    where: {
      id_userId: {
        id: input.studySetId,
        userId: ctx.session.user.id,
      },
    },
  });
};

export default deleteHandler;
