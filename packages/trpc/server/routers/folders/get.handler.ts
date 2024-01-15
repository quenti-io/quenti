import { strip } from "@quenti/lib/strip";
import type { StudiableTerm, Term } from "@quenti/prisma/client";

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
    include: {
      studySets: {
        include: {
          studySet: {
            select: {
              id: true,
              title: true,
              type: true,
              user: true,
              visibility: true,
              _count: {
                select: {
                  terms: {
                    where: {
                      ephemeral: false,
                    },
                  },
                  collaborators: true,
                },
              },
              collaborators: {
                take: 5,
                select: {
                  user: {
                    select: {
                      image: true,
                    },
                  },
                },
              },
              classesWithAccess: {
                select: {
                  classId: true,
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

  const isMyFolder = folder.userId === ctx.session.user.id;
  const studySets = folder.studySets.map((s) => s.studySet);

  const inClassIds = new Array<string>();
  if (studySets.find((s) => s.visibility == "Class")) {
    const myClasses = await ctx.prisma.classMembership.findMany({
      where: {
        userId: ctx.session.user.id,
        deletedAt: null,
      },
      select: {
        classId: true,
      },
    });
    inClassIds.push(...myClasses.map((c) => c.classId));
  }

  const studySetsICanSee = studySets.filter((s) => {
    if (s.visibility === "Public") {
      return true;
    }
    if (s.visibility === "Unlisted") {
      // Prevent users from discovering unlisted study sets
      return s.user.id === ctx.session.user.id || isMyFolder;
    }
    if (s.visibility === "Private") {
      return s.user.id === ctx.session.user.id;
    }
    if (s.visibility === "Class") {
      return s.classesWithAccess.some((c) => inClassIds.includes(c.classId));
    }

    return false;
  });

  if (
    !isMyFolder &&
    ((!!studySets.length && !studySetsICanSee.length) || !studySets.length)
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No study sets in this folder are visible to you",
    });
  }

  await ctx.prisma.container.upsert({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: folder.id,
        type: "Folder",
      },
    },
    create: {
      entityId: folder.id,
      userId: ctx.session.user.id,
      viewedAt: new Date(),
      type: "Folder",
    },
    update: {
      viewedAt: new Date(),
    },
  });

  const container = await ctx.prisma.container.findUnique({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: folder.id,
        type: "Folder",
      },
    },
    include: {
      studiableTerms: true,
    },
  });

  if (!container) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  let terms = new Array<Term>();
  let starredTerms = new Array<string>();

  if (input.includeTerms) {
    const raw = await ctx.prisma.term.findMany({
      where: {
        studySetId: {
          in: studySetsICanSee.map((s) => s.id),
        },
        ephemeral: false,
      },
    });

    for (const set of studySetsICanSee) {
      terms = terms.concat(
        raw
          .filter((t) => t.studySetId === set.id)
          .sort((a, b) => a.rank - b.rank),
      );
    }
    terms = terms.map((x, i) => ({ ...x, rank: i }));

    starredTerms = (
      await ctx.prisma.starredTerm.findMany({
        where: {
          userId: ctx.session.user.id,
          termId: {
            in: terms.map((t) => t.id),
          },
        },
      })
    ).map((t) => t.termId);
  }

  if (!starredTerms.length) {
    await ctx.prisma.container.update({
      where: {
        id: container.id,
      },
      data: {
        cardsStudyStarred: false,
        matchStudyStarred: false,
      },
    });
    container.cardsStudyStarred = false;
    container.cardsStudyStarred = false;
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
    sets: studySetsICanSee.map((s) => ({
      ...strip({
        ...s,
        classesWithAccess: undefined,
      }),
      user: {
        id: s.user.id,
        username: s.user.username,
        image: s.user.image,
        verified: s.user.verified,
      },
      collaborators: {
        total: s._count.collaborators,
        avatars: s.collaborators.map((c) => c.user.image || ""),
      },
    })),
    container: {
      id: container.id,
      entityId: container.entityId,
      userId: container.userId,
      viewedAt: container.viewedAt,
      shuffleFlashcards: container.shuffleFlashcards,
      enableCardsSorting: container.enableCardsSorting,
      cardsRound: container.cardsRound,
      cardsStudyStarred: container.cardsStudyStarred,
      cardsAnswerWith: container.cardsAnswerWith,
      matchStudyStarred: container.matchStudyStarred,
      starredTerms,
      studiableTerms: container.studiableTerms.map((x: StudiableTerm) => ({
        id: x.termId,
        mode: x.mode,
        correctness: x.correctness,
        appearedInRound: x.appearedInRound,
        incorrectCount: x.incorrectCount,
      })),
    },
    terms,
    editableSets: studySetsICanSee
      .filter((s) => s.user.id === ctx.session.user.id)
      .map((s) => s.id),
  };
};

export default getHandler;
