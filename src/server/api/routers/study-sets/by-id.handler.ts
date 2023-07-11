import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
import type { TByIdSchema } from "./by-id.schema";
import type { Language } from "../../common/constants";
import type { StarredTerm, StudiableTerm } from "@prisma/client";

type ByIdOptions = {
  ctx: NonNullableUserContext;
  input: TByIdSchema;
};

export const byIdHandler = async ({ ctx, input }: ByIdOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id: input.studySetId,
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

  await ctx.prisma.container.upsert({
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
  });

  const container = await ctx.prisma.container.findUnique({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.studySetId,
        type: "StudySet",
      },
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
    tags: studySet.tags as string[],
    wordLanguage: studySet.wordLanguage as Language,
    definitionLanguage: studySet.definitionLanguage as Language,
    user: {
      username: studySet.user.username,
      image: studySet.user.image!,
      verified: studySet.user.verified,
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
