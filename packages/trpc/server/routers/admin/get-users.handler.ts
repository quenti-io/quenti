import type { NonNullableUserContext } from "../../lib/types";

type GetUsersOptions = {
  ctx: NonNullableUserContext;
};

export const getUsersHandler = async ({ ctx }: GetUsersOptions) => {
  return {
    users: await ctx.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        verified: true,
        image: true,
        email: true,
        name: true,
        bannedAt: true,
        flags: true,
      },
    }),
  };
};

export default getUsersHandler;
