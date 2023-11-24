import { searchPhotos } from "@quenti/images/server/unsplash";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSearchSchema } from "./search.schema";

type SearchOptions = {
  ctx: NonNullableUserContext;
  input: TSearchSchema;
};

export const searchHandler = async ({ input }: SearchOptions) => {
  return await searchPhotos(input.query);
};

export default searchHandler;
