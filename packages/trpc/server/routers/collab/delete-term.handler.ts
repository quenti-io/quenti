import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteTermSchema } from "./delete-term.schema";

type DeleteTermOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteTermSchema;
};

export const deleteTermHandler = async ({ ctx, input }: DeleteTermOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      assignment: {
        studySetId: input.studySetId,
      },
      submittedAt: null,
    },
    select: {
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
  });

  if (!submission) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

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
      id_studySetId: {
        id: input.termId,
        studySetId: input.studySetId,
      },
      authorId: ctx.session.user.id,
      ephemeral: true,
    },
    select: {
      id: true,
      rank: true,
      assetUrl: true,
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
      studySetId: input.studySetId,
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
    await deleteTermAsset(input.studySetId, term.id);
  }

  await ctx.prisma.term.delete({
    where: {
      id_studySetId: {
        id: term.id,
        studySetId: input.studySetId,
      },
    },
  });

  return { deleted: input.termId };
};

export default deleteTermHandler;
