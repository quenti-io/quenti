import { StudiableMode } from "@prisma/client";
import type { Counter } from "prom-client";
import { z } from "zod";
import { register } from "../../prometheus";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studiableTermsRouter = createTRPCRouter({
  put: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        experienceId: z.string(),
        mode: z.nativeEnum(StudiableMode),
        correctness: z.number(),
        appearedInRound: z.number(),
        incorrectCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      (register.getSingleMetric("studiable_requests_total") as Counter).inc();

      await ctx.prisma.studiableTerm.upsert({
        where: {
          userId_termId: {
            userId: ctx.session.user.id,
            termId: input.id,
          },
        },
        create: {
          userId: ctx.session.user.id,
          termId: input.id,
          mode: input.mode,
          experienceId: input.experienceId,
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
});
