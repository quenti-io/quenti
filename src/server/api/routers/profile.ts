import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.string().max(40).regex(USERNAME_REGEXP))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input,
        },
        include: {
          studySets: {
            where: {
              OR: [
                {
                  visibility: "Public",
                },
                {
                  userId: ctx.session.user.id,
                },
              ],
            },
            select: {
              id: true,
              title: true,
              visibility: true,
              createdAt: true,
              _count: {
                select: {
                  terms: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return {
        id: user.id,
        username: user.username,
        image: user.image,
        verified: user.verified,
        studySets: user.studySets,
      };
    }),
});
