import { getPresignedTermAssetJwt } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { getSubmissionOrThrow } from "./common/submission";
import type { TUploadTermImageSchema } from "./upload-term-image.schema";

type UploadTermImageOptions = {
  ctx: NonNullableUserContext;
  input: TUploadTermImageSchema;
};

export const uploadTermImageHandler = async ({
  ctx,
  input,
}: UploadTermImageOptions) => {
  const submission = await getSubmissionOrThrow(
    input.submissionId,
    ctx.session.user.id,
    {
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
    input.termId,
  );

  if (!submission || !submission.assignment.studySet?.id)
    throw new TRPCError({ code: "NOT_FOUND" });

  return getPresignedTermAssetJwt(
    submission.assignment.studySet.id,
    input.termId,
  );
};

export default uploadTermImageHandler;
