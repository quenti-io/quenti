import {
  LimitedStudySetAnswerMode,
  MultipleAnswerMode,
  Prisma,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { shuffleArray } from "../../../utils/array";
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

  setEnableCardsSorting: protectedProcedure
    .input(z.object({ genericId: z.string(), enableCardsSorting: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.genericId,
          },
        },
        data: {
          enableCardsSorting: input.enableCardsSorting,
        },
      });
    }),

  setCardsStudyStarred: protectedProcedure
    .input(z.object({ genericId: z.string(), cardsStudyStarred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.genericId,
          },
        },
        data: {
          cardsStudyStarred: input.cardsStudyStarred,
          cardsRound: 0,
          studiableTerms: {
            deleteMany: {
              mode: "Flashcards",
            },
          },
        },
      });
    }),

  setCardsAnswerWith: protectedProcedure
    .input(
      z.object({
        genericId: z.string(),
        cardsAnswerWith: z.nativeEnum(LimitedStudySetAnswerMode),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.genericId,
          },
        },
        data: {
          cardsAnswerWith: input.cardsAnswerWith,
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

  setShuffleLearn: protectedProcedure
    .input(
      z.object({
        studySetId: z.string(),
        shuffleLearn: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          shuffleLearn: input.shuffleLearn,
        },
      });

      if (!experience) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.shuffleLearn) {
        const termIds = (
          await ctx.prisma.term.findMany({
            where: { studySetId: input.studySetId },
            select: { id: true },
          })
        ).map((x) => x.id);

        const shuffledIds = shuffleArray(termIds);
        const vals = shuffledIds.map((id, i) => [
          ctx.session.user.id,
          id,
          experience.id,
          experience.id,
          0,
          i,
        ]);
        const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);

        const query = Prisma.sql`
      INSERT INTO "StudiableTerm" ("userId", "termId", "experienceId", "containerId", "correctness", "studiableRank")
      VALUES ${Prisma.join(formatted)}
      ON CONFLICT ON CONSTRAINT "StudiableTerm_pkey"
      DO UPDATE SET "studiableRank" = EXCLUDED."studiableRank";
      `;

        await ctx.prisma.$executeRaw(query);
      } else {
        await ctx.prisma.studiableTerm.updateMany({
          where: {
            userId: ctx.session.user.id,
            experienceId: experience.id,
          },
          data: {
            studiableRank: null,
          },
        });
      }
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

  completeLearnRound: protectedProcedure
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

  completeCardsRound: protectedProcedure
    .input(z.object({ genericId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.genericId,
          },
        },
        data: {
          cardsRound: {
            increment: 1,
          },
        },
      });
    }),

  resetCardsProgress: protectedProcedure
    .input(z.object({ genericId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.genericId,
          },
        },
        data: {
          cardsRound: 0,
          studiableTerms: {
            deleteMany: {
              mode: "Flashcards",
            },
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
            updateMany: {
              where: {
                mode: "Learn",
              },
              data: {
                correctness: 0,
                incorrectCount: 0,
                appearedInRound: null,
              },
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
