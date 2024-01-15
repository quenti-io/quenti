import type { Language } from "@quenti/core";
import { strip } from "@quenti/lib/strip";
import type { Widen } from "@quenti/lib/widen";
import { type StarredTerm, type StudiableTerm } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { regenerateCortex } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TByIdSchema } from "./by-id.schema";
import type {
  AwaitedGet,
  AwaitedGetWithCollab,
  AwaitedGetWithDistractors,
  Collaborator,
} from "./queries";
import { get, getWithCollab, getWithDistractors } from "./queries";

type ByIdOptions = {
  ctx: NonNullableUserContext;
  input: TByIdSchema;
};

type Widened = AwaitedGet | AwaitedGetWithCollab | AwaitedGetWithDistractors;
type WidenedReturn = Widen<Widened> & {
  createdAt: Date;
  savedAt: Date;
};

type WidenedTerm = Widen<Widened["terms"][number]>;

export const byIdHandler = async ({ ctx, input }: ByIdOptions) => {
  let studySet = (
    input.withDistractors
      ? await getWithDistractors(input.studySetId)
      : input.withCollab
        ? await getWithCollab(input.studySetId, ctx.session.user.id)
        : await get(input.studySetId)
  ) as WidenedReturn;

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

  if (
    studySet.visibility === "Class" &&
    studySet.userId !== ctx.session?.user?.id
  ) {
    if (
      !(await ctx.prisma.allowedClassesOnStudySets.findFirst({
        where: {
          studySetId: input.studySetId,
          class: {
            members: {
              some: {
                userId: ctx.session.user.id,
                deletedAt: null,
              },
            },
          },
        },
      }))
    )
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This set is restricted to specific classes.",
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

  const shouldShowAssignment =
    studySet.assignment?.me?.type == "Teacher" ||
    studySet.assignment?.published;

  return {
    ...studySet,
    assignment: shouldShowAssignment
      ? strip({
          ...studySet.assignment!,
          submission: studySet.assignment!.submissions[0],
          submissions: undefined,
        })
      : undefined,
    ...strip({
      collaborators: (studySet.collaborators as Collaborator[])
        ?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((c) => ({
          id: c.user.id,
          image: c.user.image,
          username: c.user.username,
          name: c.user.displayName ? c.user.name : undefined,
        })),
    }),
    terms: input.withDistractors
      ? studySet.terms.map((t) => ({
          ...(t as WidenedTerm),
          distractors: (t as WidenedTerm).distractors!,
        }))
      : (studySet.terms as WidenedTerm[]),
    tags: studySet.tags as string[],
    wordLanguage: studySet.wordLanguage as Language,
    definitionLanguage: studySet.definitionLanguage as Language,
    user: {
      id: studySet.user.id,
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
