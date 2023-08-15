import { z } from "zod";

import { USERNAME_REGEXP } from "@quenti/lib/constants/characters";

import { TRPCError } from "@trpc/server";

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
          folders: {
            where: {
              OR: [
                {
                  userId: ctx.session.user.id,
                },
                {
                  studySets: {
                    some: {
                      studySet: {
                        OR: [
                          {
                            visibility: "Public",
                          },
                          {
                            userId: ctx.session.user.id,
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
            select: {
              id: true,
              title: true,
              slug: true,
              createdAt: true,
              studySets: {
                where: {
                  OR: [
                    {
                      folder: {
                        userId: ctx.session.user.id,
                      },
                    },
                    {
                      studySet: {
                        OR: [
                          {
                            visibility: "Public",
                          },
                          {
                            userId: ctx.session.user.id,
                          },
                        ],
                      },
                    },
                  ],
                },
                select: {
                  studySetId: true,
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
        name: user.displayName ? user.name : null,
        verified: user.verified,
        studySets: user.studySets,
        folders: user.folders,
      };
    }),
});
