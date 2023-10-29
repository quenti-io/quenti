import type { Language } from "@quenti/core";
import type { Widen } from "@quenti/lib/widen";
import { prisma } from "@quenti/prisma";
import {
  Prisma,
  type StarredTerm,
  type StudiableTerm,
} from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { regenerateCortex } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TByIdSchema } from "./by-id.schema";

type ByIdOptions = {
  ctx: NonNullableUserContext;
  input: TByIdSchema;
};

const studySetSelect = Prisma.validator<Prisma.StudySetSelect>()({
  id: true,
  userId: true,
  createdAt: true,
  savedAt: true,
  title: true,
  description: true,
  cortexStale: true,
  tags: true,
  visibility: true,
  wordLanguage: true,
  definitionLanguage: true,
  user: {
    select: {
      username: true,
      name: true,
      displayName: true,
      image: true,
      verified: true,
    },
  },
});

const termsSelect = Prisma.validator<Prisma.TermSelect>()({
  id: true,
  rank: true,
  word: true,
  definition: true,
  wordRichText: true,
  definitionRichText: true,
  studySetId: true,
});

const distractorsArgs = Prisma.validator<Prisma.Term$distractorsArgs>()({
  select: {
    type: true,
    distractor: {
      select: {
        id: true,
        word: true,
        definition: true,
        wordRichText: true,
        definitionRichText: true,
      },
    },
  },
});

const get = async (id: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      terms: {
        select: termsSelect,
      },
    },
  });
};

const getWithDistractors = async (id: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      terms: {
        select: {
          ...termsSelect,
          distractors: distractorsArgs,
        },
      },
    },
  });
};

type AwaitedGet = Awaited<ReturnType<typeof get>>;
type AwaitedGetWithDistractors = Awaited<ReturnType<typeof getWithDistractors>>;
type Widened = NonNullable<AwaitedGet> | NonNullable<AwaitedGetWithDistractors>;
type WidenedTerm = Widen<Widened["terms"][number]>;

export const byIdHandler = async ({ ctx, input }: ByIdOptions) => {
  let studySet = (
    input.withDistractors
      ? await getWithDistractors(input.studySetId)
      : await get(input.studySetId)
  ) as Widened;

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

  if (input.withDistractors && studySet.cortexStale) {
    await regenerateCortex(input.studySetId);
    studySet = (await getWithDistractors(input.studySetId)) as Widened;
  }

  const container = await ctx.prisma.container.upsert({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.studySetId,
        type: "StudySet",
      },
    },
    create: {
      entityId: input.studySetId,
      userId: ctx.session.user.id,
      viewedAt: new Date(),
      type: "StudySet",
    },
    update: {
      viewedAt: new Date(),
    },
    include: {
      starredTerms: true,
      studiableTerms: true,
    },
  });

  if (!container) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  if (!container.starredTerms.length) {
    await ctx.prisma.container.update({
      where: {
        userId_entityId_type: {
          userId: ctx.session.user.id,
          entityId: input.studySetId,
          type: "StudySet",
        },
      },
      data: {
        studyStarred: false,
        cardsStudyStarred: false,
      },
    });
    container.studyStarred = false;
    container.cardsStudyStarred = false;
    container.matchStudyStarred = false;
  }

  return {
    ...studySet,
    createdAt: new Date(studySet.createdAt),
    savedAt: new Date(studySet.savedAt),
    terms: input.withDistractors
      ? studySet.terms.map((t) => ({
          ...t,
          distractors: (t as WidenedTerm).distractors!.map((d) => ({
            ...d.distractor,
            type: d.type,
          })),
        }))
      : studySet.terms,
    tags: studySet.tags as string[],
    wordLanguage: studySet.wordLanguage as Language,
    definitionLanguage: studySet.definitionLanguage as Language,
    user: {
      username: studySet.user.username,
      image: studySet.user.image!,
      verified: studySet.user.verified,
      name: studySet.user.displayName ? studySet.user.name : undefined,
    },
    container: {
      ...container,
      starredTerms: container.starredTerms.map((x: StarredTerm) => x.termId),
      studiableTerms: container.studiableTerms.map((x: StudiableTerm) => ({
        id: x.termId,
        mode: x.mode,
        correctness: x.correctness,
        appearedInRound: x.appearedInRound,
        incorrectCount: x.incorrectCount,
        studiableRank: x.studiableRank,
      })),
    },
  };
};

export default byIdHandler;
