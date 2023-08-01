import type { NonNullableUserContext } from "../../lib/types";
import type { TCompleteLearnRoundSchema } from "./complete-learn-round.schema";

type CompleteLearnRoundOptions = {
  ctx: NonNullableUserContext;
  input: TCompleteLearnRoundSchema;
};

export const completeLearnRoundHandler = async ({
  ctx,
  input,
}: CompleteLearnRoundOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      learnRound: {
        increment: 1,
      },
    },
  });
};

export default completeLearnRoundHandler;
