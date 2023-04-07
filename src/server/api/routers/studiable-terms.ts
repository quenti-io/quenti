import { StudiableMode } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Counter } from "prom-client";
import { z } from "zod";
import { register } from "../../prometheus";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studiableTermsRouter = createTRPCRouter({
  put: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        experienceId: z.string().optional(),
        folderExperienceId: z.string().optional(),
        mode: z.nativeEnum(StudiableMode),
        correctness: z.number(),
        appearedInRound: z.number(),
        incorrectCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.experienceId && !input.folderExperienceId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide either experienceId or folderExperienceId",
        });
      }

      (register.getSingleMetric("studiable_requests_total") as Counter).inc();

      await ctx.prisma.studiableTerm.upsert({
        where: {
          userId_termId_mode: {
            userId: ctx.session.user.id,
            termId: input.id,
            mode: input.mode,
          },
        },
        create: {
          userId: ctx.session.user.id,
          termId: input.id,
          mode: input.mode,
          experienceId: input.experienceId,
          folderExperienceId: input.folderExperienceId,
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
