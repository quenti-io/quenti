import type { NonNullableUserContext } from "../../lib/types";
import type { TSetDisplayNameSchema } from "./set-display-name.schema";

type SetDisplayNameOptions = {
  ctx: NonNullableUserContext;
  input: TSetDisplayNameSchema;
};

export const setDisplayNameHandler = async ({
  ctx,
  input,
}: SetDisplayNameOptions) => {
  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      displayName: input.displayName,
    },
  });
};

export default setDisplayNameHandler;
