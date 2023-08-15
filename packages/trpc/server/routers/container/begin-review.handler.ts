import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TBeginReviewSchema } from "./begin-review.schema";

type BeginReviewOptions = {
  ctx: NonNullableUserContext;
  input: TBeginReviewSchema;
};

export const beginReviewHandler = async ({
  ctx,
  input,
}: BeginReviewOptions) => {
  const container = await ctx.prisma.container.findUnique({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    include: {
      studiableTerms: true,
    },
  });

  if (!container) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (!container.studiableTerms.filter((x) => x.incorrectCount > 0).length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No terms to review",
    });
  }

  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      learnMode: "Review",
      learnRound: 0,
      studiableTerms: {
        updateMany: {
          where: {
            containerId: container.id,
          },
          data: {
            appearedInRound: null,
            correctness: 0,
          },
        },
      },
    },
  });
};

export default beginReviewHandler;
