import { TRPCError } from "@trpc/server";

import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetUserStatisticsSchema } from "./get-user-statistics.schema";

type GetUserStatisticsOptions = {
  ctx: NonNullableUserContext;
  input: TGetUserStatisticsSchema;
};

export const getUserStatisticsHandler = async ({
  ctx,
  input,
}: GetUserStatisticsOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.id)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const result = await ctx.prisma.user.groupBy({
    by: ["type"],
    where: {
      organizationId: input.id,
    },
    _count: {
      _all: true,
    },
  });

  return result.map((r) => ({
    type: r.type,
    count: r._count._all,
  }));
};

export default getUserStatisticsHandler;
