import type { NonNullableUserContext } from "../../lib/types";
import type { TSetStudyStarredSchema } from "./set-study-starred.schema";

type SetStudyStarredOptions = {
  ctx: NonNullableUserContext;
  input: TSetStudyStarredSchema;
};

export const setStudyStarredHandler = async ({
  ctx,
  input,
}: SetStudyStarredOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      studyStarred: input.studyStarred,
    },
  });
};

export default setStudyStarredHandler;
