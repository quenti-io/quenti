import { z } from "zod";

import { StudiableMode } from "@quenti/prisma/client";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studiableTermsRouter = createTRPCRouter({
  put: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        containerId: z.string(),
        mode: z.nativeEnum(StudiableMode),
        correctness: z.number(),
        appearedInRound: z.number(),
        incorrectCount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studiableTerm.upsert({
        where: {
          userId_containerId_termId_mode: {
            userId: ctx.session.user.id,
            containerId: input.containerId,
            termId: input.id,
            mode: input.mode,
          },
        },
        create: {
          userId: ctx.session.user.id,
          termId: input.id,
          mode: input.mode,
          containerId: input.containerId,
          correctness: input.correctness,
          appearedInRound: input.appearedInRound,
          incorrectCount: input.incorrectCount,
        },
        update: {
          correctness: input.correctness,
          incorrectCount: input.incorrectCount,
          appearedInRound: input.appearedInRound,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        containerId: z.string(),
        mode: z.nativeEnum(StudiableMode),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.studiableTerm.delete({
          where: {
            userId_containerId_termId_mode: {
              userId: ctx.session.user.id,
              containerId: input.containerId,
              termId: input.id,
              mode: input.mode,
            },
          },
        });
      } catch {}
    }),
});
