import type { NonNullableUserContext } from "../../../lib/types";
import type { TResetLearnProgressSchema } from "./reset-learn-progress.schema";

type ResetLearnProgressOptions = {
  ctx: NonNullableUserContext;
  input: TResetLearnProgressSchema;
};

export const resetLearnProgressHandler = async ({
  ctx,
  input,
}: ResetLearnProgressOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      learnMode: "Learn",
      learnRound: 0,
      studiableTerms: {
        updateMany: {
          where: {
            mode: "Learn",
          },
          data: {
            correctness: 0,
            incorrectCount: 0,
            appearedInRound: null,
          },
        },
      },
    },
  });
};

export default resetLearnProgressHandler;
