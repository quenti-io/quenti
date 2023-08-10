import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";

type GetBeloningOptions = {
  ctx: NonNullableUserContext;
};

export const getBelongingHandler = async ({ ctx }: GetBeloningOptions) => {
  const org = await ctx.prisma.organization.findFirst({
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
      },
      _count: {
        select: {
          users: true,
          members: true,
        },
      },
    },
  });

  if (!org) throw new TRPCError({ code: "NOT_FOUND" });

  return {
    id: org.id,
    name: org.name,
    icon: org.icon,
    members: undefined,
    _count: org._count,
  };
};

export default getBelongingHandler;
