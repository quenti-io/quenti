import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const experienceRouter = createTRPCRouter({
  setShuffle: protectedProcedure
    .input(z.object({ studySetId: z.string(), shuffle: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          shuffleFlashcards: input.shuffle,
        },
      });
    }),

  setStudyStarred: protectedProcedure
    .input(z.object({ studySetId: z.string(), studyStarred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          studyStarred: input.studyStarred,
        },
      });
    }),

  setAnswerMode: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        answerWith: z.enum(["Word", "Definition", "Both"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          answerWith: input.answerWith,
        },
      });
    }),

  starTerm: protectedProcedure
    .input(z.object({ experienceId: z.string(), termId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.starredTerm.create({
        data: {
          termId: input.termId,
          experienceId: input.experienceId,
          userId: ctx.session.user.id,
        },
      });
    }),

  unstarTerm: protectedProcedure
    .input(z.object({ termId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.starredTerm.delete({
        where: {
          userId_termId: {
            termId: input.termId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  completeRound: protectedProcedure
    .input(z.object({ studySetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          learnRound: {
            increment: 1,
          },
        },
      });
    }),

  resetLearnProgress: protectedProcedure
    .input(z.object({ studySetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          learnRound: 0,
          studiableTerms: {
            deleteMany: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
