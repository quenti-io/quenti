import { StarredTerm, StudySetExperience } from "@prisma/client";
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

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const studySet = await ctx.prisma.studySet.findUnique({
      where: {
        id: input,
      },
      include: {
        terms: true,
      },
    });
    console.log(studySet?.terms);

    if (!studySet) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    let experience = await ctx.prisma.studySetExperience.findUnique({
      where: {
        userId_studySetId: {
          userId: ctx.session.user.id,
          studySetId: input,
        },
      },
      include: {
        starredTerms: true,
      },
    });

    if (!experience) {
      experience = {
        ...(await ctx.prisma.studySetExperience.create({
          data: {
            studySetId: input,
            userId: ctx.session.user.id,
          },
        })),
        starredTerms: [],
      };
    }

    return {
      ...studySet,
      experience: {
        ...experience,
        starredTerms: experience.starredTerms.map((x: StarredTerm) => x.termId),
      },
    };
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
