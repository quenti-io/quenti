import { TRPCError } from "@trpc/server";

import { MATCH_MIN_TIME } from "../../common/constants";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddSchema } from "./add.schema";
import { validateLeaderboardAccess } from "./utils/access";

type AddOptions = {
  ctx: NonNullableUserContext;
  input: TAddSchema;
};

export const addHandler = async ({ ctx, input }: AddOptions) => {
  const leaderboard = await ctx.prisma.leaderboard.upsert({
    where: {
      entityId_type: {
        entityId: input.entityId,
        type: input.mode,
      },
    },
    create: {
      entityId: input.entityId,
      type: input.mode,
    },
    update: {},
    select: {
      id: true,
      entityId: true,
      studySet: {
        select: {
          id: true,
          visibility: true,
          userId: true,
        },
      },
      folder: {
        select: {
          userId: true,
          studySets: {
            select: {
              studySet: {
                select: {
                  id: true,
                  userId: true,
                  visibility: true,
                },
              },
            },
          },
        },
      },
    },
  });
  validateLeaderboardAccess(leaderboard, ctx.session.user.id);

  if (input.time < MATCH_MIN_TIME) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "This site is not for robots.",
    });
  }

  const highscore = await ctx.prisma.highscore.findUnique({
    where: {
      leaderboardId_userId_eligible: {
        leaderboardId: leaderboard.id,
        userId: ctx.session.user.id,
        eligible: input.eligible,
      },
    },
  });

  if (highscore && highscore.time < input.time) {
    return null;
  }

  await ctx.prisma.highscore.upsert({
    where: {
      leaderboardId_userId_eligible: {
        leaderboardId: leaderboard.id,
        userId: ctx.session.user.id,
        eligible: input.eligible,
      },
    },
    create: {
      time: input.time,
      timestamp: new Date(),
      leaderboardId: leaderboard.id,
      userId: ctx.session.user.id,
      eligible: input.eligible,
    },
    update: {
      time: input.time,
      timestamp: new Date(),
    },
  });
};

export default addHandler;
