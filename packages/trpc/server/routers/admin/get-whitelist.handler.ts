import type { NonNullableUserContext } from "../../lib/types";

type GetWhitelistOptions = {
  ctx: NonNullableUserContext;
};

export const getWhitelistHandler = async ({ ctx }: GetWhitelistOptions) => {
  return {
    whitelist: await ctx.prisma.whitelistedEmail.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    regexes: await ctx.prisma.allowedEmailRegex.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    attemtps: await ctx.prisma.recentFailedLogin.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  };
};

export default getWhitelistHandler;
