import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TByEntityIdSchema } from "./by-entity-id.schema";
import { validateLeaderboardAccess } from "./utils/access";

type ByEntityIdOptions = {
  ctx: NonNullableUserContext;
  input: TByEntityIdSchema;
};

export const byEntityIdHandler = async ({ ctx, input }: ByEntityIdOptions) => {
  const leaderboard = await ctx.prisma.leaderboard.findFirst({
    where: {
      entityId: input.entityId,
      type: input.mode,
    },
    include: {
      highscores: {
        where: {
          eligible: true,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              verified: true,
            },
          },
        },
        orderBy: {
          time: "asc",
        },
      },
      studySet: true,
      folder: {
        include: {
          studySets: {
            include: {
              studySet: true,
            },
          },
        },
      },
    },
  });

  if (!leaderboard) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  validateLeaderboardAccess(leaderboard, ctx.session.user.id);
  return { ...leaderboard, studySet: undefined, folder: undefined };
};

export default byEntityIdHandler;
