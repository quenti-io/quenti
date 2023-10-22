import type { NonNullableUserContext } from "../../lib/types";
import type { TCompleteCardsRoundSchema } from "./complete-cards-round.schema";

type CompleteCardsRoundOptions = {
  ctx: NonNullableUserContext;
  input: TCompleteCardsRoundSchema;
};

export const completeCardsRoundHandler = async ({
  ctx,
  input,
}: CompleteCardsRoundOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      cardsRound: {
        increment: 1,
      },
    },
  });
};

export default completeCardsRoundHandler;
