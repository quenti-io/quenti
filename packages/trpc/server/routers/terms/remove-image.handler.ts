import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveImageSchema } from "./remove-image.schema";

type RemoveImageOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveImageSchema;
};

export const removeImageHandler = async ({
  ctx,
  input,
}: RemoveImageOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    select: {
      id: true,
      assetUrl: true,
    },
  });

  if (!term) throw new TRPCError({ code: "NOT_FOUND" });

  if (env.ASSETS_BUCKET_URL && term.assetUrl?.startsWith(env.ASSETS_BUCKET_URL))
    await deleteTermAsset(studySet.id, term.id);

  return await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    data: {
      assetUrl: null,
    },
  });
};

export default removeImageHandler;
