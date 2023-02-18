import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { MAX_TERM } from "../common/constants";
import { profanity } from "../common/profanity";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const termsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z
        .object({
          studySetId: z.string(),
          term: z.object({
            word: z.string(),
            rank: z.number().min(0),
            definition: z.string(),
          }),
        })
        .transform((z) => ({
          ...z,
          term: {
            ...z.term,
            word: profanity.censor(z.term.word.slice(0, MAX_TERM)),
            definition: profanity.censor(z.term.definition.slice(0, MAX_TERM)),
          },
        }))
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

      // censorup all ranks so that all values are consecutive
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

      return await ctx.prisma.term.create({
        data: {
          ...input.term,
          id: nanoid(),
          studySetId: input.studySetId,
        },
      });
    }),

  bulkAdd: protectedProcedure
    .input(
      z
        .object({
          studySetId: z.string(),
          terms: z.array(
            z.object({
              word: z.string(),
              definition: z.string(),
            })
          ),
        })
        .transform((z) => ({
          ...z,
          terms: z.terms.map((term) => ({
            ...term,
            word: profanity.censor(term.word.slice(0, MAX_TERM)),
            definition: profanity.censor(term.definition.slice(0, MAX_TERM)),
          })),
        }))
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

      const data = input.terms.map((term, i) => ({
        ...term,
        id: nanoid(),
        studySetId: input.studySetId,
        rank: studySet._count.terms + i,
      }));

      await ctx.prisma.term.createMany({
        data,
      });

      return data;
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
      // censorup all ranks so that all values are consecutive
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

      const term = await ctx.prisma.term.findUnique({
        where: {
          id_studySetId: {
            id: input.term.id,
            studySetId: input.studySetId,
          },
        },
      });

      if (!term) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const currentRank = term.rank;

      // Update the rank of the terms in bulk moving the current term from currentRank to input.term.rank
      await ctx.prisma.term.updateMany({
        where: {
          studySetId: input.studySetId,
          rank: {
            gte: Math.min(currentRank, input.term.rank),
            lte: Math.max(currentRank, input.term.rank),
          },
        },
        data: {
          rank: {
            increment: currentRank <= input.term.rank ? -1 : 1,
          },
        },
      });

      // Update the rank of the current term
      return await ctx.prisma.term.update({
        where: {
          id_studySetId: {
            id: input.term.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          rank: input.term.rank,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z
        .object({
          studySetId: z.string(),
          id: z.string(),
          word: z.string(),
          definition: z.string(),
        })
        .transform((z) => ({
          ...z,
          word: profanity.censor(z.word.slice(0, MAX_TERM)),
          definition: profanity.censor(z.definition.slice(0, MAX_TERM)),
        }))
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
          id_studySetId: {
            id: input.id,
            studySetId: input.studySetId,
          },
        },
        data: {
          word: input.word,
          definition: input.definition,
        },
      });
      return term;
    }),

  bulkEdit: protectedProcedure
    .input(
      z
        .object({
          studySetId: z.string(),
          terms: z.array(
            z.object({
              id: z.string(),
              word: z.string(),
              definition: z.string(),
            })
          ),
        })
        .transform((z) => ({
          ...z,
          terms: z.terms.map((term) => ({
            ...term,
            word: profanity.censor(term.word.slice(0, MAX_TERM)),
            definition: profanity.censor(term.definition.slice(0, MAX_TERM)),
          })),
        }))
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

      const vals = input.terms.map((term) => [
        term.id,
        term.word,
        term.definition,
      ]);

      // This query took 3 hours to figure out
      const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);
      const query = Prisma.sql`
        UPDATE "Term" SET "word" = t.word, "definition" = t.definition
        FROM (VALUES ${Prisma.join(formatted)}) AS t(id, word, definition)
        WHERE "Term"."id" = t.id
        ${Prisma.sql`AND "Term"."studySetId" = ${input.studySetId}`}
        `;

      await ctx.prisma.$executeRaw(query);
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
      if (studySet._count.terms <= 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Set must contain at least one term",
        });
      }

      const term = await ctx.prisma.term.findUnique({
        where: {
          id_studySetId: {
            id: input.termId,
            studySetId: input.studySetId,
          },
        },
      });

      if (!term) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      // censorup all ranks so that all values are consecutive
      await ctx.prisma.term.updateMany({
        where: {
          studySetId: input.studySetId,
          rank: {
            gt: term.rank,
          },
        },
        data: {
          rank: {
            decrement: 1,
          },
        },
      });

      await ctx.prisma.term.delete({
        where: {
          id_studySetId: {
            id: input.termId,
            studySetId: input.studySetId,
          },
        },
      });

      return { deleted: input.termId };
    }),
});
