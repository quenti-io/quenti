import {
  type PrismaClient,
  type StarredTerm,
  type StudiableTerm,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  LANGUAGE_VALUES,
  MAX_CHARS_TAGS,
  MAX_DESC,
  MAX_NUM_TAGS,
  MAX_TERM,
  MAX_TITLE,
  type Language,
} from "../common/constants";
import { profanity } from "../common/profanity";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const getRecentStudySets = async (
  prisma: PrismaClient,
  userId: string,
  exclude?: string[]
) => {
  const recentExperiences = await prisma.studySetExperience.findMany({
    where: {
      userId: userId,
      NOT: {
        OR: [
          {
            studySetId: {
              in: exclude ?? [],
            },
          },
          {
            studySet: {
              user: {
                username: "Quizlet",
              },
            },
          },
        ],
      },
      studySet: {
        OR: [
          {
            visibility: {
              not: "Private",
            },
          },
          {
            userId: userId,
          },
        ],
      },
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 16,
  });
  const experienceIds = recentExperiences.map((e) => e.studySetId);

  return (
    await prisma.studySet.findMany({
      where: {
        id: {
          in: experienceIds,
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            terms: true,
          },
        },
      },
    })
  )
    .sort((a, b) => experienceIds.indexOf(a.id) - experienceIds.indexOf(b.id))
    .map((set) => ({
      ...set,
      viewedAt: recentExperiences.find((e) => e.studySetId === set.id)!
        .viewedAt,
      user: {
        username: set.user.username,
        image: set.user.image!,
      },
    }));
};

export const studySetsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    const studySet = ctx.prisma.studySet.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      include: {
        user: true,
        _count: {
          select: {
            terms: true,
          },
        },
      },
    });
    return studySet;
  }),

  recent: protectedProcedure
    .input(
      z.object({
        exclude: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await getRecentStudySets(
        ctx.prisma,
        ctx.session?.user?.id,
        input.exclude
      );
    }),

  getOfficial: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.studySet.findMany({
      where: {
        user: {
          username: "Quizlet",
        },
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            terms: true,
          },
        },
      },
    });
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const studySet = await ctx.prisma.studySet.findUnique({
      where: {
        id: input,
      },
      include: {
        user: true,
        terms: true,
      },
    });

    if (!studySet) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    if (
      studySet.visibility === "Private" &&
      studySet.userId !== ctx.session?.user?.id
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This set is private.",
      });
    }

    await ctx.prisma.studySetExperience.upsert({
      where: {
        userId_studySetId: {
          userId: ctx.session.user.id,
          studySetId: input,
        },
      },
      create: {
        studySetId: input,
        userId: ctx.session.user.id,
        viewedAt: new Date(),
      },
      update: {
        viewedAt: new Date(),
      },
    });

    const experience = await ctx.prisma.studySetExperience.findUnique({
      where: {
        userId_studySetId: {
          userId: ctx.session.user.id,
          studySetId: input,
        },
      },
      include: {
        starredTerms: true,
        studiableTerms: true,
      },
    });

    if (!experience) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    if (!experience.starredTerms.length) {
      await ctx.prisma.studySetExperience.update({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input,
          },
        },
        data: {
          studyStarred: false,
        },
      });
    }

    return {
      ...studySet,
      wordLanguage: studySet.wordLanguage as Language,
      definitionLanguage: studySet.definitionLanguage as Language,
      user: {
        username: studySet.user.username,
        image: studySet.user.image!,
        verified: studySet.user.verified,
      },
      experience: {
        ...experience,
        starredTerms: experience.starredTerms.map((x: StarredTerm) => x.termId),
        studiableTerms: experience.studiableTerms.map((x: StudiableTerm) => ({
          id: x.termId,
          correctness: x.correctness,
          appearedInRound: x.appearedInRound,
          incorrectCount: x.incorrectCount,
        })),
      },
    };
  }),

  createFromAutosave: protectedProcedure.mutation(async ({ ctx }) => {
    const autoSave = await ctx.prisma.setAutoSave.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        autoSaveTerms: true,
      },
    });

    if (!autoSave) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    if (!autoSave.title.trim().length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Set title is required.",
      });
    }

    await ctx.prisma.setAutoSave.delete({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const studySet = await ctx.prisma.studySet.create({
      data: {
        title: profanity.censor(autoSave.title.slice(0, MAX_TITLE)),
        description: profanity.censor(autoSave.description.slice(0, MAX_DESC)),
        tags: autoSave.tags
          .slice(0, MAX_NUM_TAGS)
          .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
        wordLanguage: autoSave.wordLanguage,
        definitionLanguage: autoSave.definitionLanguage,
        visibility: autoSave.visibility,
        userId: ctx.session.user.id,
        terms: {
          createMany: {
            data: autoSave.autoSaveTerms.map((term) => ({
              id: term.id,
              word: profanity.censor(term.word.slice(0, MAX_TERM)),
              definition: profanity.censor(term.definition.slice(0, MAX_TERM)),
              rank: term.rank,
            })),
          },
        },
      },
    });

    return studySet;
  }),

  edit: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          title: z.string().trim().min(1),
          description: z.string(),
          tags: z.array(z.string()),
          wordLanguage: z.enum(LANGUAGE_VALUES),
          definitionLanguage: z.enum(LANGUAGE_VALUES),
          visibility: z.enum(["Public", "Unlisted", "Private"]),
        })
        .transform((z) => ({
          ...z,
          title: profanity.censor(z.title),
          description: profanity.censor(z.description.slice(0, MAX_DESC)),
          tags: z.tags
            .slice(0, MAX_NUM_TAGS)
            .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
        }))
    )
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.prisma.studySet.update({
        where: {
          id_userId: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          wordLanguage: input.wordLanguage,
          definitionLanguage: input.definitionLanguage,
          visibility: input.visibility,
        },
      });

      return studySet;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.studySet.delete({
        where: {
          id_userId: {
            id: input,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
