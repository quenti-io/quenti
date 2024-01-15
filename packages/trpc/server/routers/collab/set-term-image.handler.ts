import { triggerDownload } from "@quenti/images/server/unsplash";

import { getIp } from "../../lib/get-ip";
import { getCachedPhoto } from "../../lib/images/photo";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import { getSubmissionOrThrow } from "./common/submission";
import type { TSetTermImageSchema } from "./set-term-image.schema";

type SetTermImageOptions = {
  ctx: NonNullableUserContext;
  input: TSetTermImageSchema;
};

export const setTermImageHandler = async ({
  ctx,
  input,
}: SetTermImageOptions) => {
  await rateLimitOrThrowMultiple({
    type: RateLimitType.Fast,
    identifiers: [
      `terms:set-image-user-id-${ctx.session.user.id}`,
      `terms:set-image-ip-${getIp(ctx.req)}`,
    ],
  });

  await getSubmissionOrThrow(input.submissionId, ctx.session.user.id);

  const photo = await getCachedPhoto(ctx, input.query, input.index);
  await triggerDownload(photo.links.download_location);

  return await ctx.prisma.term.update({
    where: {
      id_submissionId: {
        id: input.id,
        submissionId: input.submissionId,
      },
    },
    data: {
      assetUrl: photo.urls.small,
    },
  });
};

export default setTermImageHandler;
