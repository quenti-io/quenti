import type { NonNullableUserContext } from "../../lib/types";
import type { TEditCollabSchema } from "./edit-collab.schema";

type EditCollabOptions = {
  ctx: NonNullableUserContext;
  input: TEditCollabSchema;
};

export const editCollabHandler = async ({ ctx, input }: EditCollabOptions) => {
  return await ctx.prisma.studySetCollab.update({
    where: {
      id: input.id,
      studySet: {
        userId: ctx.session.user.id,
      },
    },
    data: {
      type: input.type,
      minTermsPerUser: input.minTermsPerUser,
      maxTermsPerUser: input.maxTermsPerUser,
    },
  });
};

export default editCollabHandler;
