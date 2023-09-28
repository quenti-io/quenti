import { getPresignedObjectAssetJwt } from "@quenti/images/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadLogoSchema } from "./upload-logo.schema";

type UploadLogoOptions = {
  ctx: NonNullableUserContext;
  input: TUploadLogoSchema;
};

export const uploadLogoHandler = async ({ ctx, input }: UploadLogoOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  return getPresignedObjectAssetJwt("class", input.classId, "logo");
};

export default uploadLogoHandler;
