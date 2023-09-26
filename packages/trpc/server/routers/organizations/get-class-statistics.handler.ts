import { TRPCError } from "@trpc/server";

import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetClassStatisticsSchema } from "./get-class-statistics.schema";

type GetClassStatisticsOptions = {
  ctx: NonNullableUserContext;
  input: TGetClassStatisticsSchema;
};

export const getClassStatisticsHandler = async ({
  ctx,
  input,
}: GetClassStatisticsOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.id)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const result = await ctx.prisma.class.groupBy({
    by: ["cortexCategory"],
    where: {
      orgId: input.id,
    },
    _count: {
      _all: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  return result.map((r) => ({
    category: r.cortexCategory,
    count: r._count._all,
  }));
};

export default getClassStatisticsHandler;
