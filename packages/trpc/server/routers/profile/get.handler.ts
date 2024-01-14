import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      username: input.username,
    },
    include: {
      studySets: {
        where: {
          created: true,
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
              terms: {
                where: {
                  ephemeral: false,
                },
              },
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
};

export default getHandler;
