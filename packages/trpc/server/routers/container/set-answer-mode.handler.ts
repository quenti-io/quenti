import type { NonNullableUserContext } from "../../lib/types";
import type { TSetAnswerModeSchema } from "./set-answer-mode.schema";

type SetAnswerModeOptions = {
  ctx: NonNullableUserContext;
  input: TSetAnswerModeSchema;
};

export const setAnswerModeHandler = async ({
  ctx,
  input,
}: SetAnswerModeOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      answerWith: input.answerWith,
    },
  });
};

export default setAnswerModeHandler;
