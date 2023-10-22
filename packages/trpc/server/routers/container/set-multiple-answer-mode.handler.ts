import type { NonNullableUserContext } from "../../lib/types";
import type { TSetMultipleAnswerModeSchema } from "./set-multiple-answer-mode.schema";

type SetMutlipleAnswerModeOptions = {
  ctx: NonNullableUserContext;
  input: TSetMultipleAnswerModeSchema;
};

export const setMultipleAnswerModeHandler = async ({
  ctx,
  input,
}: SetMutlipleAnswerModeOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      multipleAnswerMode: input.multipleAnswerMode,
    },
  });
};

export default setMultipleAnswerModeHandler;
