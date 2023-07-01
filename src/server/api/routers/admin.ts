import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { refineRegex } from "../common/validation";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  landing: adminProcedure.query(async ({ ctx }) => {
    const [
      studySets,
      terms,
      studiableTerms,
      starredTerms,
      folders,
      containers,
    ] = await ctx.prisma.$transaction([
      ctx.prisma.studySet.count(),
      ctx.prisma.term.count(),
      ctx.prisma.studiableTerm.count(),
      ctx.prisma.starredTerm.count(),
      ctx.prisma.folder.count(),
      ctx.prisma.container.count(),
    ]);

    return {
      studySets,
      terms,
      studiableTerms,
      starredTerms,
      folders,
      containers,
      grafanaUrl: env.GRAFANA_DASHBOARD_URL,
    };
  }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
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
          flags: true,
        },
      }),
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

  setEnabledFlags: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        flags: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          flags: input.flags,
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
      regexes: await ctx.prisma.allowedEmailRegex.findMany({
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

  addRegex: adminProcedure
    .input(
      z.object({
        regex: z.string().refine(...refineRegex),
        label: z.string().trim().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.allowedEmailRegex.create({
        data: {
          regex: input.regex,
          label: input.label,
        },
      });
    }),

  editRegex: adminProcedure
    .input(
      z.object({
        oldRegex: z.string(),
        newRegex: z.string().refine(...refineRegex),
        label: z.string().trim().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.allowedEmailRegex.update({
        where: {
          regex: input.oldRegex,
        },
        data: {
          regex: input.newRegex,
          label: input.label,
        },
      });
    }),

  removeRegex: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.allowedEmailRegex.delete({
        where: {
          regex: input,
        },
      });
    }),
});
