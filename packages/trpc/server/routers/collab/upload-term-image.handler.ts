import { getPresignedTermAssetJwt } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadTermImageSchema } from "./upload-term-image.schema";

type UploadTermImageOptions = {
  ctx: NonNullableUserContext;
  input: TUploadTermImageSchema;
};

export const uploadTermImageHandler = async ({
  ctx,
  input,
}: UploadTermImageOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      submittedAt: null,
      assignment: {
        published: true,
      },
      terms: {
        some: {
          id: input.termId,
        },
      },
    },
    select: {
      assignment: {
        select: {
          studySet: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!submission || !submission.assignment.studySet?.id)
    throw new TRPCError({ code: "NOT_FOUND" });

  return getPresignedTermAssetJwt(
    submission.assignment.studySet.id,
    input.termId,
  );
};

export default uploadTermImageHandler;
