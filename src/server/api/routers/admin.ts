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
          email: true,
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

  getWhitelist: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.whitelistedEmail.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  whitelistEmail: adminProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.whitelistedEmail.create({
        data: {
          email: input,
        },
      });
    }),

  removeEmail: adminProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.whitelistedEmail.delete({
        where: {
          email: input,
        },
      });
    })
});
