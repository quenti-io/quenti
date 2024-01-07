import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { getSubmissionOrThrow, saveSubmisson } from "./common/submission";
import type { TRemoveTermImageSchema } from "./remove-term-image.schema";

type RemoveTermImageOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveTermImageSchema;
};

export const removeTermImageHandler = async ({
  ctx,
  input,
}: RemoveTermImageOptions) => {
  await getSubmissionOrThrow(input.submissionId, ctx.session.user.id);

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_submissionId: {
        id: input.id,
        submissionId: input.submissionId,
      },
    },
    select: {
      id: true,
      assetUrl: true,
      studySetId: true,
    },
  });

  if (!term) throw new TRPCError({ code: "NOT_FOUND" });

  if (env.ASSETS_BUCKET_URL && term.assetUrl?.startsWith(env.ASSETS_BUCKET_URL))
    await deleteTermAsset(term.studySetId, term.id);

  const updated = await ctx.prisma.term.update({
    where: {
      id_submissionId: {
        id: input.id,
        submissionId: input.submissionId,
      },
    },
    data: {
      assetUrl: null,
    },
  });

  await saveSubmisson(input.submissionId);
  return updated;
};

export default removeTermImageHandler;
