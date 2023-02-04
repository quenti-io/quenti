import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  landing: adminProcedure.query(async ({ ctx }) => {
    return {
      users: await ctx.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          createdAt: true,
          verified: true,
          image: true,
          name: true,
        },
      }),
      studySets: await ctx.prisma.studySet.count(),
      terms: await ctx.prisma.term.count(),
      studiableTerms: await ctx.prisma.studiableTerm.count(),
      starredTerms: await ctx.prisma.starredTerm.count(),
      folders: await ctx.prisma.folder.count(),
      experiences: await ctx.prisma.studySetExperience.count(),
    };
  }),

  verifyUser: adminProcedure
    .input(z.object({ userId: z.string(), verified: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          verified: input.verified,
        },
      });
    }),
});
