import type { Language } from "@quenti/core";
import type { Widen } from "@quenti/lib/widen";
import { prisma } from "@quenti/prisma";
import { type StarredTerm, type StudiableTerm } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { regenerateCortex } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TByIdSchema } from "./by-id.schema";
import { distractorsArgs, studySetSelect, termsSelect } from "./queries";

type ByIdOptions = {
  ctx: NonNullableUserContext;
  input: TByIdSchema;
};

const get = async (id: string) => {
  return await prisma.studySet.findUnique({
    where: {
      id,
    },
    select: {
      ...studySetSelect,
      created: true,
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
      created: true,
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

  if (!studySet.created) {
    throw new TRPCError({
      code:
        ctx.session.user.id === studySet.userId
          ? "PRECONDITION_FAILED"
          : "NOT_FOUND",
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
    const start = Date.now();

    const distractors = await regenerateCortex(input.studySetId);

    ctx.req.log.debug("cortex.bulkGenerateDistractors", {
      studySetId: studySet.id,
      terms: studySet.terms.length,
      distractors: distractors.length,
      batches: Math.ceil(studySet.terms.length / 96),
      elapsed: Date.now() - start,
    });

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
