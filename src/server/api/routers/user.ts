import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
import { env } from "../../../env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  checkUsername: protectedProcedure
    .input(z.string().max(40).regex(USERNAME_REGEXP))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input,
        },
      });

      return user === null || user.id === ctx.session.user.id;
    }),

  changeUsername: protectedProcedure
    .input(z.string().max(40).regex(USERNAME_REGEXP))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.username.toLowerCase() == "quizlet") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to change official account username.",
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

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
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
