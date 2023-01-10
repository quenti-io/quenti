import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const termsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        term: z.object({
          term: z.string().max(50),
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

      const term = await ctx.prisma.term.create({
        data: {
          ...input.term,
          studySetId: input.studySetId,
          index: studySet._count.terms,
        },
      });
      return term;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        term: z.object({
          termId: z.string(),
          term: z.string().max(50),
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
      });

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const term = await ctx.prisma.term.update({
        where: {
          id: input.term.termId,
        },
        data: {
          term: input.term.term,
          definition: input.term.definition,
        },
      });
      return term;
    }),
});
