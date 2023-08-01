import type { NonNullableUserContext } from "../../lib/types";
import type { TSetMatchStudyStarredSchema } from "./set-match-study-starred.schema";

type SetMatchStudyStarredOptions = {
  ctx: NonNullableUserContext;
  input: TSetMatchStudyStarredSchema;
};

export const setMatchStudyStarredHandler = async ({
  ctx,
  input,
}: SetMatchStudyStarredOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      matchStudyStarred: input.matchStudyStarred,
    },
  });
};

export default setMatchStudyStarredHandler;
