import type { NonNullableUserContext } from "../../../lib/types";

type GetBeloningOptions = {
  ctx: NonNullableUserContext;
};

export const getBelongingHandler = async ({ ctx }: GetBeloningOptions) => {
  const organizations = await ctx.prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: ctx.session.user.id,
        },
      },
    },
    include: {
      members: {
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          accepted: true,
        },
      },
      _count: {
        select: {
          users: true,
          members: true,
        },
      },
    },
  });

  return organizations.map((org) => ({
    ...org,
    members: undefined,
    accepted: org.members[0]!.accepted,
  }));
};

export default getBelongingHandler;
