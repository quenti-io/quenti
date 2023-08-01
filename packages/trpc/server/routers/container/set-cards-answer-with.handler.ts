import type { NonNullableUserContext } from "../../lib/types";
import type { TSetCardsAnswerWithSchema } from "./set-cards-answer-with.schema";

type SetCardsAnswerWithOptions = {
  ctx: NonNullableUserContext;
  input: TSetCardsAnswerWithSchema;
};

export const setCardsAnswerWithHandler = async ({
  ctx,
  input,
}: SetCardsAnswerWithOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      cardsAnswerWith: input.cardsAnswerWith,
    },
  });
};

export default setCardsAnswerWithHandler;
