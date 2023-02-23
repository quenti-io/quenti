import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
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
          bannedAt: true,
        },
      }),
      studySets: await ctx.prisma.studySet.count(),
      terms: await ctx.prisma.term.count(),
      studiableTerms: await ctx.prisma.studiableTerm.count(),
      starredTerms: await ctx.prisma.starredTerm.count(),
      folders: await ctx.prisma.folder.count(),
      experiences: await ctx.prisma.studySetExperience.count(),
      grafanaUrl: env.GRAFANA_DASHBOARD_URL,
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

  banUser: adminProcedure
    .input(z.object({ userId: z.string(), banned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      if (user.email == env.ADMIN_EMAIL || user.id == ctx.session?.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Admin account cannot be banned",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          bannedAt: input.banned ? new Date() : null,
        },
      });
    }),

  getWhitelist: adminProcedure.query(async ({ ctx }) => {
    return {
      whitelist: await ctx.prisma.whitelistedEmail.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
      attemtps: await ctx.prisma.recentFailedLogin.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    };
  }),

  removeFailedLogin: adminProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.recentFailedLogin.delete({
        where: {
          email: input,
        },
      });
    }),

  allowFailedLogin: adminProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.recentFailedLogin.delete({
        where: {
          email: input,
        },
      });

      await ctx.prisma.whitelistedEmail.create({
        data: {
          email: input,
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
    }),
});
