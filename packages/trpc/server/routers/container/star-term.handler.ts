import type { NonNullableUserContext } from "../../lib/types";
import type { TStarTermSchema } from "./star-term.schema";

type StarTermOptions = {
  ctx: NonNullableUserContext;
  input: TStarTermSchema;
};

export const starTermHandler = async ({ ctx, input }: StarTermOptions) => {
  await ctx.prisma.starredTerm.create({
    data: {
      termId: input.termId,
      containerId: input.containerId,
      userId: ctx.session.user.id,
    },
  });
};

export default starTermHandler;
