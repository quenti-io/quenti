import type { Term } from "@quenti/prisma/client";

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
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const folder = await ctx.prisma.folder.findFirst({
    where: {
      OR: [
        {
          userId: user.id,
          id: input.idOrSlug,
        },
        {
          userId: user.id,
          slug: input.idOrSlug,
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      user: {
        select: {
          id: true,
          username: true,
          image: true,
          verified: true,
        },
      },
      studySets: {
        where: {
          studySet: {
            visibility: "Public",
          },
        },
        select: {
          studySet: {
            select: {
              id: true,
              title: true,
              user: true,
              visibility: true,
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
        },
      },
    },
  });

  if (!folder) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (!folder.studySets.length) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No study sets in this folder are visible to you",
    });
  }

  let terms = new Array<Term>();

  if (input.includeTerms) {
    const raw = await ctx.prisma.term.findMany({
      where: {
        studySetId: {
          in: folder.studySets.map((s) => s.studySet.id),
        },
        ephemeral: false,
      },
    });

    for (const set of folder.studySets) {
      terms = terms.concat(
        raw
          .filter((t) => t.studySetId === set.studySet.id)
          .sort((a, b) => a.rank - b.rank),
      );
    }
    terms = terms.map((x, i) => ({ ...x, rank: i }));
  }

  return {
    id: folder.id,
    title: folder.title,
    description: folder.description,
    user: {
      id: user.id,
      username: user.username,
      image: user.image,
      verified: user.verified,
    },
    sets: folder.studySets
      .map((s) => s.studySet)
      .map((s) => ({
        ...s,
        user: {
          id: s.user.id,
          username: s.user.username,
          image: s.user.image,
          verified: s.user.verified,
        },
      })),
    container: null,
    terms,
    editableSets: [],
  };
};

export default getPublicHandler;
