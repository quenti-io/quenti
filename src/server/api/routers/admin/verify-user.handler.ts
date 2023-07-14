import type { NonNullableUserContext } from "../../../lib/types";
import type { TVerifyUserSchema } from "./verify-user.schema";

type VerifyUserOptions = {
  ctx: NonNullableUserContext;
  input: TVerifyUserSchema;
};

export const verifyUserHandler = async ({ ctx, input }: VerifyUserOptions) => {
  await ctx.prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      verified: input.verified,
    },
  });
};

export default verifyUserHandler;
