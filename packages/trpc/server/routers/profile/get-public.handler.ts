import { TRPCError } from "@trpc/server";

import type { DefaultContext } from "../../lib/types";
import type { TGetPublicSchema } from "./get-public.schema";

type GetPublicOptions = {
  ctx: DefaultContext;
  input: TGetPublicSchema;
};

export const getPublicHandler = async ({ ctx, input }: GetPublicOptions) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      username: input.username,
    },
    select: {
      id: true,
      username: true,
      image: true,
      displayName: true,
      name: true,
      verified: true,
      studySets: {
        where: {
          visibility: "Public",
          created: true,
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
          studySets: {
            some: {
              studySet: {
                visibility: "Public",
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          studySets: {
            where: {
              studySet: {
                visibility: "Public",
              },
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

export default getPublicHandler;
