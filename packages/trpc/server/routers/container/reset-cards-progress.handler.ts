import type { NonNullableUserContext } from "../../lib/types";
import type { TResetCardsProgressSchema } from "./reset-cards-progress.schema";

type ResetCardsProgressOptions = {
  ctx: NonNullableUserContext;
  input: TResetCardsProgressSchema;
};

export const resetCardsProgressHandler = async ({
  ctx,
  input,
}: ResetCardsProgressOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      cardsRound: 0,
      studiableTerms: {
        deleteMany: {
          mode: "Flashcards",
        },
      },
    },
  });
};

export default resetCardsProgressHandler;
