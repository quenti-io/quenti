import { getTermAssetUrl } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { getSubmissionOrThrow, saveSubmisson } from "./common/submission";
import type { TUploadTermImageSchema } from "./upload-term-image.schema";

type UploadTermImageCompleteOptions = {
  ctx: NonNullableUserContext;
  input: TUploadTermImageSchema;
};

export const uploadTermImageCompleteHandler = async ({
  ctx,
  input,
}: UploadTermImageCompleteOptions) => {
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

  const url = await getTermAssetUrl(
    submission.assignment.studySet.id,
    input.termId,
  );
  if (!url) return;

  await ctx.prisma.term.update({
    where: {
      id_submissionId: {
        id: input.termId,
        submissionId: input.submissionId,
      },
    },
    data: {
      assetUrl: url,
    },
  });

  await saveSubmisson(input.submissionId);
  return { url };
};

export default uploadTermImageCompleteHandler;
