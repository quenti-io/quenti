import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveTermImageSchema } from "./remove-term-image.schema";

type RemoveTermImageOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveTermImageSchema;
};

export const removeTermImageHandler = async ({
  ctx,
  input,
}: RemoveTermImageOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      submittedAt: null,
    },
  });

  if (!submission) throw new TRPCError({ code: "NOT_FOUND" });

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

  return await ctx.prisma.term.update({
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
};

export default removeTermImageHandler;
