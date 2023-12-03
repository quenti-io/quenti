import { rateLimitOrThrow } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TImportProfileSchema } from "./import-profile.schema";

type ImportProfileOptions = {
  ctx: NonNullableUserContext;
  input: TImportProfileSchema;
};

export const importProfileHandler = async ({
  ctx,
  input,
}: ImportProfileOptions) => {

};

export default importProfileHandler;
