import { triggerDownload } from "@quenti/images/server/unsplash";

import { TRPCError } from "@trpc/server";

import { getCachedPhoto } from "../../lib/images/photo";
import type { NonNullableUserContext } from "../../lib/types";
import type { TSetImageSchema } from "./set-image.schema";

type SetImageOptions = {
  ctx: NonNullableUserContext;
  input: TSetImageSchema;
};

export const setImageHandler = async ({ ctx, input }: SetImageOptions) => {
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
  const photo = await getCachedPhoto(ctx, input.query, input.index);
  await triggerDownload(photo.links.download_location);

  return await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    data: {
      assetUrl: photo.urls.small,
    },
  });
};

export default setImageHandler;
