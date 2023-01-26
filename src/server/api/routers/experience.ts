import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const experienceRouter = createTRPCRouter({
  // get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
  //   const experience = ctx.prisma.studySetExperience.findFirst({
  //     where: {
  //       studySetId: input,
  //       userId: ctx.session.user.id,
  //     },
  //     include: {
  //       starredTerms: true,
  //     }
  //   });
  // }
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

      return await ctx.prisma.starredTerm.create({
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
      return await ctx.prisma.starredTerm.delete({
        where: {
          userId_termId: {
            termId: input.termId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
