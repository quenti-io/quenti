import { LeaderboardType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const leaderboardRouter = createTRPCRouter({
    bySetId: protectedProcedure.input(z.object({
        mode: z.nativeEnum(LeaderboardType),
        setId: z.string()
    })).query(async ({ ctx, input }) => {
        const leaderboard = await ctx.prisma.leaderboard.findFirst({
            where: {
                studySetId: input.setId,
                type: input.mode
            },
            include: {
                highscores: true,
                studySet: true
            }
        })

        if (!leaderboard) {
            throw new TRPCError({
                code: "NOT_FOUND",
            });
        }

        if (
            leaderboard.studySet &&
            leaderboard.studySet!.visibility === "Private" &&
            leaderboard.studySet!.userId !== ctx.session?.user?.id
        ) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This set is private.",
            });
        }


        return {
            ...leaderboard,
            highscores: leaderboard.highscores.sort((a,b) => a.time - b.time),
            studySet: null
        }
    }),
    add: protectedProcedure.input(z.object({
        mode: z.nativeEnum(LeaderboardType),
        time: z.number(),
        id: z.string()
    })).query(async ({ ctx, input }) => {
        let leaderboard = await ctx.prisma.leaderboard.findUnique({
            where: {
                id: input.id
            },
            include: {
                studySet: true
            }
        })

        if (
            leaderboard?.studySet &&
            leaderboard.studySet!.visibility === "Private" &&
            leaderboard.studySet!.userId !== ctx.session?.user?.id
        ) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This set is private.",
            });
        }

        let res = await ctx.prisma.highscore.create({
            data: {
                time: input.time,
                leaderboardId: input.id,
                userId: ctx.session.user.id
            }
        }).leaderboard({
            include: {
                highscores: true
            }
        })

        return {
            ...res,
            highscores: res.highscores.sort((a,b) => a.time - b.time),
            studySet: null
        }
    }
})
