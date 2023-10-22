import type { NonNullableUserContext } from "../../lib/types";
import type { TSetCardsStudyStarredSchema } from "./set-cards-study-starred.schema";

type SetCardsStudyStarredOptions = {
  ctx: NonNullableUserContext;
  input: TSetCardsStudyStarredSchema;
};

export const setCardsStudyStarredHandler = async ({
  ctx,
  input,
}: SetCardsStudyStarredOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      cardsStudyStarred: input.cardsStudyStarred,
      cardsRound: 0,
      studiableTerms: {
        deleteMany: {
          mode: "Flashcards",
        },
      },
    },
  });
};

export default setCardsStudyStarredHandler;
