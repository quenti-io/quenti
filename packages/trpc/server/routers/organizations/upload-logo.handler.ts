import { getPresignedObjectAssetJwt } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadLogoSchema } from "./upload-logo.schema";

type UploadLogoOptions = {
  ctx: NonNullableUserContext;
  input: TUploadLogoSchema;
};

export const uploadLogoHandler = async ({ ctx, input }: UploadLogoOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return getPresignedObjectAssetJwt("organization", input.orgId, "logo");
};

export default uploadLogoHandler;
