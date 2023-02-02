import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
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
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input,
        },
      });
    }),
});
