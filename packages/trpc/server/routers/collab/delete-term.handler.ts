import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { getSubmissionOrThrow, saveSubmisson } from "./common/submission";
import type { TDeleteTermSchema } from "./delete-term.schema";

type DeleteTermOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteTermSchema;
};

export const deleteTermHandler = async ({ ctx, input }: DeleteTermOptions) => {
  const submission = await getSubmissionOrThrow(
    input.submissionId,
    ctx.session.user.id,
    {
      id: true,
      assignment: {
        select: {
          studySet: {
            select: {
              collab: {
                select: {
                  type: true,
                  minTermsPerUser: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  );

  const collab = submission.assignment.studySet?.collab;
  if (!collab) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  if (
    collab.type == "Default" &&
    submission._count.terms <= (collab.minTermsPerUser || 0)
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_submissionId: {
        id: input.termId,
        submissionId: input.submissionId,
      },
      authorId: ctx.session.user.id,
      ephemeral: true,
    },
    select: {
      id: true,
      rank: true,
      assetUrl: true,
      studySetId: true,
    },
  });

  if (!term) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  // Update all ranks so that all values are consecutive
  await ctx.prisma.term.updateMany({
    where: {
      submissionId: input.submissionId,
      ephemeral: true,
      rank: {
        gt: term.rank,
      },
    },
    data: {
      rank: {
        decrement: 1,
      },
    },
  });

  if (
    env.ASSETS_BUCKET_URL &&
    term.assetUrl?.startsWith(env.ASSETS_BUCKET_URL)
  ) {
    await deleteTermAsset(term.studySetId, term.id);
  }

  await ctx.prisma.term.delete({
    where: {
      id_submissionId: {
        id: term.id,
        submissionId: input.submissionId,
      },
    },
  });

  await saveSubmisson(input.submissionId);
  return { deleted: input.termId };
};

export default deleteTermHandler;
