import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { reorder } from "../terms/mutations/reorder";
import { getSubmissionOrThrow } from "./common/submission";
import type { TReorderTermSchema } from "./reorder-term.schema";

type ReorderTermOptions = {
  ctx: NonNullableUserContext;
  input: TReorderTermSchema;
};

export const reorderTermHandler = async ({
  ctx,
  input,
}: ReorderTermOptions) => {
  await getSubmissionOrThrow(input.submissionId, ctx.session.user.id);

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

export default reorderTermHandler;
