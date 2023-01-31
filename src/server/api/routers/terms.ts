import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const termsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        term: z.object({
          word: z.string().max(50),
          rank: z.number().min(0),
          definition: z.string().max(100),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.prisma.studySet.findFirst({
        where: {
          id: input.studySetId,
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: {
              terms: true,
            },
          },
        },
      });

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      // Cleanup all ranks so that all values are consecutive
      await ctx.prisma.term.updateMany({
        where: {
          studySetId: input.studySetId,
          rank: {
            gte: input.term.rank,
          },
        },
        data: {
          rank: {
            increment: 1,
          },
        },
      });

      const term = await ctx.prisma.term.create({
        data: {
          ...input.term,
          studySetId: input.studySetId,
        },
      });
      return term;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        term: z.object({
          id: z.string(),
          rank: z.number().min(0),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Cleanup all ranks so that all values are consecutive
      const currentRank = (await ctx.prisma.term.findFirst({
        where: {
          id: input.term.id,
        },
      }))!.rank;

      if (currentRank < input.term.rank) {
        await ctx.prisma.term.updateMany({
          where: {
            studySetId: input.studySetId,
            rank: {
              gte: currentRank,
              lte: input.term.rank,
            },
          },
          data: {
            rank: {
              decrement: 1,
            },
          },
        });
      } else {
        await ctx.prisma.term.updateMany({
          where: {
            studySetId: input.studySetId,
            rank: {
              lte: currentRank,
              gte: input.term.rank,
            },
          },
          data: {
            rank: {
              increment: 1,
            },
          },
        });
      }
    }),

  edit: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        id: z.string(),
        word: z.string(),
        definition: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.prisma.studySet.findFirst({
        where: {
          id: input.studySetId,
          userId: ctx.session.user.id,
        },
      });

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const term = await ctx.prisma.term.update({
        where: {
          id: input.id,
        },
        data: {
          word: input.word,
          definition: input.definition,
        },
      });
      return term;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        termId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.prisma.studySet.findFirst({
        where: {
          id: input.studySetId,
          userId: ctx.session.user.id,
        },
      });

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const term = await ctx.prisma.term.delete({
        where: {
          id: input.termId,
        },
      });
      return term;
    }),
});
