import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const studySetsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    const studySet = ctx.prisma.studySet.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      include: {
        _count: {
          select: {
            terms: true,
          },
        },
      },
    });
    return studySet;
  }),

  byId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    const studySet = ctx.prisma.studySet.findFirst({
      where: {
        id: input,
        userId: ctx.session.user.id,
      },
      include: {
        terms: true,
      },
    });
    return studySet;
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.prisma.studySet.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return studySet;
    }),
});
