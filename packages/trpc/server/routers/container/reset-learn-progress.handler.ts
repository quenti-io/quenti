import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TResetLearnProgressSchema } from "./reset-learn-progress.schema";

type ResetLearnProgressOptions = {
  ctx: NonNullableUserContext;
  input: TResetLearnProgressSchema;
};

export const resetLearnProgressHandler = async ({
  ctx,
  input,
}: ResetLearnProgressOptions) => {
  const container = await ctx.prisma.container.findUnique({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    select: {
      id: true,
      studyStarred: true,
    },
  });

  if (!container) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const starredTerms = container.studyStarred
    ? await ctx.prisma.starredTerm.findMany({
        where: {
          containerId: container.id,
          userId: ctx.session.user.id,
        },
        select: {
          termId: true,
        },
      })
    : [];

  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      learnMode: "Learn",
      learnRound: 0,
      studiableTerms: {
        updateMany: {
          where: {
            mode: "Learn",
            ...(container.studyStarred
              ? { termId: { in: starredTerms.map((t) => t.termId) } }
              : {}),
          },
          data: {
            correctness: 0,
            incorrectCount: 0,
            appearedInRound: null,
          },
        },
      },
    },
  });
};

export default resetLearnProgressHandler;
