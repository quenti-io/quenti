import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { reorder } from "../terms/mutations/reorder";
import type { TReorderTermsSchema } from "./reorder-terms.schema";

type ReorderTermsOptions = {
  ctx: NonNullableUserContext;
  input: TReorderTermsSchema;
};

export const reorderTermsHandler = async ({
  ctx,
  input,
}: ReorderTermsOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      submittedAt: null,
    },
  });

  if (!submission) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_submissionId: {
        id: input.term.id,
        submissionId: input.submissionId,
      },
    },
    select: {
      rank: true,
      studySetId: true,
    },
  });

  if (!term) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const currentRank = term.rank;

  await ctx.prisma.$transaction(async (prisma) => {
    await prisma.term.updateMany({
      where: {
        submissionId: input.submissionId,
        rank: {
          gte: Math.min(currentRank, input.term.rank),
          lte: Math.max(currentRank, input.term.rank),
        },
      },
      data: {
        rank: {
          increment: currentRank <= input.term.rank ? -1 : 1,
        },
      },
    });

    // Update the rank of the current term
    await prisma.term.update({
      where: {
        id_submissionId: {
          id: input.term.id,
          submissionId: input.submissionId,
        },
      },
      data: {
        rank: input.term.rank,
      },
    });
  });

  await reorder(ctx.prisma, term.studySetId, input.submissionId);
};

export default reorderTermsHandler;
