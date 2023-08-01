import type { NonNullableUserContext } from "../../lib/types";
import type { TSetEnableCardsSortingSchema } from "./set-enable-cards-sorting.schema";

type SetEnableCardsSortingOptions = {
  ctx: NonNullableUserContext;
  input: TSetEnableCardsSortingSchema;
};

export const setEnableCardsSortingHandler = async ({
  ctx,
  input,
}: SetEnableCardsSortingOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      enableCardsSorting: input.enableCardsSorting,
    },
  });
};

export default setEnableCardsSortingHandler;
