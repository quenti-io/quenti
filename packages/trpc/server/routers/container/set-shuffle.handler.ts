import type { NonNullableUserContext } from "../../lib/types";
import type { TSetShuffleSchema } from "./set-shuffle.schema";

type SetShuffleOptions = {
  ctx: NonNullableUserContext;
  input: TSetShuffleSchema;
};

export const setShuffleHandler = async ({ ctx, input }: SetShuffleOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      shuffleFlashcards: input.shuffle,
    },
  });
};

export default setShuffleHandler;
