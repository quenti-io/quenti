import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

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

  starTerm: protectedProcedure
    .input(z.object({ studySetId: z.string(), termId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.prisma.studySetExperience.upsert({
        where: {
          userId_studySetId: {
            studySetId: input.studySetId,
            userId: ctx.session.user.id,
          },
        },
        update: {},
        create: {
          studySetId: input.studySetId,
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.starredTerm.create({
        data: {
          termId: input.termId,
          experienceId: experience.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  unstarTerm: protectedProcedure
    .input(z.object({ studySetId: z.string(), termId: z.string() }))
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
});
