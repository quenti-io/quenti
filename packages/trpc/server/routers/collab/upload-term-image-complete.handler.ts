import { getTermAssetUrl } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { saveSubmisson } from "./common/submission";
import type { TUploadTermImageSchema } from "./upload-term-image.schema";

type UploadTermImageCompleteOptions = {
  ctx: NonNullableUserContext;
  input: TUploadTermImageSchema;
};

export const uploadTermImageCompleteHandler = async ({
  ctx,
  input,
}: UploadTermImageCompleteOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      submittedAt: null,
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
