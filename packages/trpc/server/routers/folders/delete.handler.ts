import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  await ctx.prisma.folder.delete({
    where: {
      id_userId: {
        id: input.folderId,
        userId: ctx.session.user.id,
      },
    },
  });
};

export default deleteHandler;
