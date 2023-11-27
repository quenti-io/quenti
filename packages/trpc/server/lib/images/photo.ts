import { getCachedSearch, searchPhotos } from "@quenti/images/server/unsplash";

import { TRPCError } from "@trpc/server";

import { getIp } from "../get-ip";
import { RateLimitType, rateLimitOrThrowMultiple } from "../rate-limit";
import type { NonNullableUserContext } from "../types";

export const getCachedPhoto = async (
  ctx: NonNullableUserContext,
  query: string,
  index: number,
) => {
  let cached = await getCachedSearch(query);

  // If for some reason the user waits an hour before selecting a photo, the
  // cache will have expired and we'll have to hit the API again.
  if (!cached) {
    await rateLimitOrThrowMultiple({
      type: RateLimitType.Rare,
      identifiers: [
        `images:select-uncached-user-id-${ctx.session.user.id}`,
        `images:select-uncached-ip-${getIp(ctx.req)}`,
      ],
    });
    cached = await searchPhotos(query, false, true);
  }

  const photo = cached?.response?.results[index];

  if (!photo)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "no_photo_found",
    });

  return photo;
};
