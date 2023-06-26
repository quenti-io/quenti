import { LeaderboardType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MATCH_MIN_TIME } from "../common/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const leaderboardRouter = createTRPCRouter({
  bySetId: protectedProcedure
    .input(
      z.object({
        mode: z.nativeEnum(LeaderboardType),
        setId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          studySetId: input.setId,
          type: input.mode,
        },
        include: {
          highscores: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              time: "asc",
            },
          },
          studySet: true,
        },
      });

      if (!leaderboard) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        leaderboard.studySet &&
        leaderboard.studySet.visibility === "Private" &&
        leaderboard.studySet.userId !== ctx.session?.user?.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This set is private.",
        });
      }

      return { ...leaderboard, studySet: undefined };
    }),

  highscore: protectedProcedure
    .input(
      z.object({ mode: z.nativeEnum(LeaderboardType), studySetId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          studySetId: input.studySetId,
          type: input.mode,
        },
      });
      if (!leaderboard) return { bestTime: null };

      const highscore = await ctx.prisma.highscore.findUnique({
        where: {
          leaderboardId_userId: {
            leaderboardId: leaderboard.id,
            userId: ctx.session.user.id,
          },
        },
      });

      return { bestTime: highscore?.time ?? null };
    }),

  add: protectedProcedure
    .input(
      z.object({
        mode: z.nativeEnum(LeaderboardType),
        time: z.number(),
        studySetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          studySetId: input.studySetId,
          type: input.mode,
        },
        include: {
          studySet: true,
        },
      });

      if (!leaderboard) {
        leaderboard = await ctx.prisma.leaderboard.create({
          data: {
            containerId: input.studySetId,
            studySetId: input.studySetId,
            type: input.mode,
          },
          include: {
            studySet: true,
          },
        });
      }

      if (
        leaderboard.studySet &&
        leaderboard.studySet.visibility === "Private" &&
        leaderboard.studySet.userId !== ctx.session?.user?.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This set is private.",
        });
      }

      if (input.time < MATCH_MIN_TIME) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "This site is not for robots.",
        });
      }

      const highscore = await ctx.prisma.highscore.findUnique({
        where: {
          leaderboardId_userId: {
            leaderboardId: leaderboard.id,
            userId: ctx.session.user.id,
          },
        },
      });

      if (highscore && highscore.time < input.time) {
        return null;
      }

      await ctx.prisma.highscore.upsert({
        where: {
          leaderboardId_userId: {
            leaderboardId: leaderboard.id,
            userId: ctx.session.user.id,
          },
        },
        create: {
          time: input.time,
          timestamp: new Date(),
          leaderboardId: leaderboard.id,
          userId: ctx.session.user.id,
        },
        update: {
          time: input.time,
          timestamp: new Date(),
        },
      });
    }),
});
