import type { NonNullableUserContext } from "../../lib/types";

type GetOfficialOptions = {
  ctx: NonNullableUserContext;
};

export const getOfficialHandler = async ({ ctx }: GetOfficialOptions) => {
  return await ctx.prisma.studySet.findMany({
    where: {
      user: {
        username: "Quizlet",
      },
    },
    include: {
      user: {
        select: {
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  });
};

export default getOfficialHandler;
