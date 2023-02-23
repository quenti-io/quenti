import { MultipleAnswerMode } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, lockedProcedure, protectedProcedure } from "../trpc";

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

  setMutlipleAnswerMode: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        multipleAnswerMode: z.nativeEnum(MultipleAnswerMode),
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
          multipleAnswerMode: input.multipleAnswerMode,
        },
      });
    }),

  setExtendedFeedbackBank: lockedProcedure(["ExtendedFeedbackBank"])
    .input(
      z.object({
        studySetId: z.string(),
        extendedFeedbackBank: z.boolean(),
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
          extendedFeedbackBank: input.extendedFeedbackBank,
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
          learnMode: "Learn",
          learnRound: 0,
          studiableTerms: {
            deleteMany: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),

  beginReview: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.prisma.studySetExperience.findUnique({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input,
          },
        },
        include: {
          studiableTerms: true,
        },
      });

      if (!experience) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        !experience.studiableTerms.filter((x) => x.incorrectCount > 0).length
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No terms to review",
        });
      }

      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input,
          },
        },
        data: {
          learnMode: "Review",
          learnRound: 0,
          studiableTerms: {
            updateMany: {
              where: {
                experienceId: experience.id,
              },
              data: {
                appearedInRound: null,
                correctness: 0,
              },
            },
          },
        },
      });
    }),
});
