import { searchPhotos } from "@quenti/images/server/unsplash";

import { getIp } from "../../lib/get-ip";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TSearchSchema } from "./search.schema";

type SearchOptions = {
  ctx: NonNullableUserContext;
  input: TSearchSchema;
};

export const searchHandler = async ({ ctx, input }: SearchOptions) => {
  await rateLimitOrThrowMultiple({
    type: RateLimitType.Fast,
    identifiers: [
      `images:search-user-id${ctx.session.user.id}`,
      `images:search-ip-${getIp(ctx.req)}`,
    ],
  });

  return await searchPhotos(input.query);
};

export default searchHandler;
