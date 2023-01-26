import { TRPCError } from "@trpc/server";
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
        studySetExperiences: {
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            starredTerms: true,
          },
        },
      },
    });
    return studySet;
  }),

  createFromAutosave: protectedProcedure.mutation(async ({ ctx }) => {
    const autoSave = await ctx.prisma.setAutoSave.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        autoSaveTerms: true,
      },
    });

    if (!autoSave) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const studySet = await ctx.prisma.studySet.create({
      data: {
        title: autoSave.title,
        description: autoSave.description,
        userId: ctx.session.user.id,
        terms: {
          createMany: {
            data: autoSave.autoSaveTerms.map((x) => ({
              id: x.id,
              word: x.word,
              definition: x.definition,
            })),
          },
        },
        termOrder: autoSave.autoSaveTermOrder,
      },
    });

    await ctx.prisma.setAutoSave.delete({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return studySet;
  }),
});
