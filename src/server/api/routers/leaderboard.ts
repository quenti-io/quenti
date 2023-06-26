import {
  LeaderboardType,
  type Folder,
  type Leaderboard,
  type StudySet,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MATCH_MIN_TIME } from "../common/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const validateLeaderboardAccess = (
  leaderboard: Leaderboard & {
    studySet: StudySet | null;
    folder: (Folder & { studySets: { studySet: StudySet }[] }) | null;
  },
  userId: string
) => {
  if (
    leaderboard.studySet &&
    leaderboard.studySet.visibility === "Private" &&
    leaderboard.studySet.userId !== userId
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This set is private.",
    });
  } else if (leaderboard.folder && leaderboard.folder.userId !== userId) {
    // Check if the user has access to at least one set in the folder
    const studySets = leaderboard.folder.studySets.map((x) => x.studySet);
    for (const s of studySets) {
      if (s.visibility == "Public" || s.userId == userId) return;
    }

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this folder.",
    });
  }
};

export const leaderboardRouter = createTRPCRouter({
  byContainerId: protectedProcedure
    .input(
      z.object({
        mode: z.nativeEnum(LeaderboardType),
        containerId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          containerId: input.containerId,
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
    }),

  highscore: protectedProcedure
    .input(
      z.object({ mode: z.nativeEnum(LeaderboardType), containerId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          containerId: input.containerId,
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
        studySetId: z.string().optional(),
        folderId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const containerId = input.studySetId ?? input.folderId;
      if (!containerId) throw new TRPCError({ code: "BAD_REQUEST" });

      let leaderboard = await ctx.prisma.leaderboard.findFirst({
        where: {
          containerId,
          type: input.mode,
        },
        include: {
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
        leaderboard = await ctx.prisma.leaderboard.create({
          data: {
            containerId,
            studySetId: input.studySetId,
            folderId: input.folderId,
            type: input.mode,
          },
          include: {
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
      }

      validateLeaderboardAccess(leaderboard, ctx.session.user.id);

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
