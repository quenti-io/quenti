import type { NonNullableUserContext } from "../../lib/types";
import type { TSetEnabledFlagsSchema } from "./set-enabled-flags.schema";

type SetEnabledFlagsOptions = {
  ctx: NonNullableUserContext;
  input: TSetEnabledFlagsSchema;
};

export const setEnabledFlagsHandler = async ({
  ctx,
  input,
}: SetEnabledFlagsOptions) => {
  await ctx.prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      flags: input.flags,
    },
  });
};

export default setEnabledFlagsHandler;
