import { getPresignedTermAssetJwt } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadImageSchema } from "./upload-image.schema";

type UploadImageOptions = {
  ctx: NonNullableUserContext;
  input: TUploadImageSchema;
};

export const uploadImageHandler = async ({
  ctx,
  input,
}: UploadImageOptions) => {
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

  return getPresignedTermAssetJwt(input.studySetId, input.termId);
};

export default uploadImageHandler;
