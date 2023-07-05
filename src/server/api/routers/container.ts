import {
  ContainerType,
  LimitedStudySetAnswerMode,
  MultipleAnswerMode,
  Prisma,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { shuffleArray } from "../../../utils/array";
import { EnabledFeature } from "../common/constants";
import { createTRPCRouter, lockedProcedure, protectedProcedure } from "../trpc";

export const containerRouter = createTRPCRouter({
  setShuffle: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        type: z.nativeEnum(ContainerType),
        shuffle: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
          },
        },
        data: {
          shuffleFlashcards: input.shuffle,
        },
      });
    }),

  setEnableCardsSorting: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        type: z.nativeEnum(ContainerType),
        enableCardsSorting: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
          },
        },
        data: {
          enableCardsSorting: input.enableCardsSorting,
        },
      });
    }),

  setCardsStudyStarred: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        type: z.nativeEnum(ContainerType),
        cardsStudyStarred: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
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
        entityId: z.string(),
        type: z.nativeEnum(ContainerType),
        cardsAnswerWith: z.nativeEnum(LimitedStudySetAnswerMode),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
          },
        },
        data: {
          cardsAnswerWith: input.cardsAnswerWith,
        },
      });
    }),

  setMatchStudyStarred: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        type: z.nativeEnum(ContainerType),
        matchStudyStarred: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
          },
        },
        data: {
          matchStudyStarred: input.matchStudyStarred,
        },
      });
    }),

  setStudyStarred: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        studyStarred: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
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
        entityId: z.string(),
        answerWith: z.enum(["Word", "Definition", "Both"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
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
        entityId: z.string(),
        multipleAnswerMode: z.nativeEnum(MultipleAnswerMode),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
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
        entityId: z.string(),
        shuffleLearn: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const container = await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
          },
        },
        data: {
          shuffleLearn: input.shuffleLearn,
        },
      });

      if (!container) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.shuffleLearn) {
        const termIds = (
          await ctx.prisma.term.findMany({
            where: { studySetId: input.entityId },
            select: { id: true },
          })
        ).map((x) => x.id);

        const shuffledIds = shuffleArray(termIds);
        const vals = shuffledIds.map((id, i) => [
          ctx.session.user.id,
          id,
          container.id,
          0,
          i,
        ]);
        const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);

        const query = Prisma.sql`
      INSERT INTO StudiableTerm (userId, termId, containerId, correctness, studiableRank)
      VALUES ${Prisma.join(formatted)}
      ON DUPLICATE KEY UPDATE studiableRank = VALUES(studiableRank);
      `;

        await ctx.prisma.$executeRaw(query);
      } else {
        await ctx.prisma.studiableTerm.updateMany({
          // Using half of the composite primary key
          where: {
            userId: ctx.session.user.id,
            containerId: container.id,
          },
          data: {
            studiableRank: null,
          },
        });
      }
    }),

  setExtendedFeedbackBank: lockedProcedure([
    EnabledFeature.ExtendedFeedbackBank,
  ])
    .input(
      z.object({
        entityId: z.string(),
        extendedFeedbackBank: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
          },
        },
        data: {
          extendedFeedbackBank: input.extendedFeedbackBank,
        },
      });
    }),

  starTerm: protectedProcedure
    .input(z.object({ containerId: z.string(), termId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.starredTerm.create({
        data: {
          termId: input.termId,
          containerId: input.containerId,
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
    .input(z.object({ entityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
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
    .input(
      z.object({ entityId: z.string(), type: z.nativeEnum(ContainerType) })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
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
    .input(
      z.object({ entityId: z.string(), type: z.nativeEnum(ContainerType) })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: input.type,
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
    .input(z.object({ entityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input.entityId,
            type: "StudySet",
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
      const container = await ctx.prisma.container.findUnique({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input,
            type: "StudySet",
          },
        },
        include: {
          studiableTerms: true,
        },
      });

      if (!container) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        !container.studiableTerms.filter((x) => x.incorrectCount > 0).length
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No terms to review",
        });
      }

      await ctx.prisma.container.update({
        where: {
          userId_entityId_type: {
            userId: ctx.session.user.id,
            entityId: input,
            type: "StudySet",
          },
        },
        data: {
          learnMode: "Review",
          learnRound: 0,
          studiableTerms: {
            updateMany: {
              where: {
                containerId: container.id,
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
