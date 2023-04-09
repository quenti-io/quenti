import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
import { env } from "../../../env/server.mjs";
import { usernameProfanity } from "../common/profanity";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import pjson from "../../../../package.json";
const version = pjson.version;

export const userRouter = createTRPCRouter({
  checkUsername: protectedProcedure
    .input(z.string().max(40).regex(USERNAME_REGEXP))
    .query(async ({ ctx, input }) => {
      if (usernameProfanity.exists(input)) {
        return {
          available: false,
          isProfane: true,
        };
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input,
        },
      });

      return {
        available: user === null || user.id === ctx.session.user.id,
        isProfane: false,
      };
    }),

  changeUsername: protectedProcedure
    .input(z.string().max(40).regex(USERNAME_REGEXP))
    .mutation(async ({ ctx, input }) => {
      ctx.req.log.debug("user.changeUsername");

      if (ctx.session.user.username.toLowerCase() == "quizlet") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to change official account username.",
        });
      }
      if (usernameProfanity.exists(input)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username contains profanity.",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input,
        },
      });
    }),

  setDisplayName: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          displayName: input,
        },
      });
    }),

  viewChangelog: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        changelogVersion: version,
      },
    });
  }),

  setEnableUsageData: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          enableUsageData: input,
        },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.req.log.debug("user.deleteAccount");

    if (ctx.session.user.email == env.ADMIN_EMAIL) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to delete admin account.",
      });
    }
    if (ctx.session.user.username.toLowerCase() == "quizlet") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to delete official account.",
      });
    }

    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
