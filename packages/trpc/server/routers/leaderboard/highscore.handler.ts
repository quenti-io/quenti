import type { NonNullableUserContext } from "../../lib/types";
import type { THighscoreSchema } from "./highscore.schema";

type HighscoreOptions = {
  ctx: NonNullableUserContext;
  input: THighscoreSchema;
};

export const highscoreHandler = async ({ ctx, input }: HighscoreOptions) => {
  const leaderboard = await ctx.prisma.leaderboard.findFirst({
    where: {
      entityId: input.entityId,
      type: input.mode,
    },
  });
  if (!leaderboard) return { bestTime: null };

  const highscore = await ctx.prisma.highscore.findUnique({
    where: {
      leaderboardId_userId_eligible: {
        leaderboardId: leaderboard.id,
        userId: ctx.session.user.id,
        eligible: input.eligible,
      },
    },
  });

  return { bestTime: highscore?.time ?? null };
};

export default highscoreHandler;
