import { getTermAssetUrl } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadImageSchema } from "./upload-image.schema";

type UploadImageCompleteOptions = {
  ctx: NonNullableUserContext;
  input: TUploadImageSchema;
};

export const uploadImageCompleteHandler = async ({
  ctx,
  input,
}: UploadImageCompleteOptions) => {
  if (
    !(await ctx.prisma.studySet.findUnique({
      where: {
        id: input.studySetId,
        userId: ctx.session.user.id,
        terms: {
          some: {
            id: input.termId,
          },
        },
      },
    }))
  )
    throw new TRPCError({ code: "NOT_FOUND" });

  const url = await getTermAssetUrl(input.studySetId, input.termId);
  if (!url) return;

  await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.termId,
        studySetId: input.studySetId,
      },
    },
    data: {
      assetUrl: url,
    },
  });

  return { url };
};

export default uploadImageCompleteHandler;
