import { getObjectAssetUrl, thumbhashFromCdn } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUploadLogoCompleteSchema } from "./upload-logo-complete.schema";

type UploadLogoCompleteOptions = {
  ctx: NonNullableUserContext;
  input: TUploadLogoCompleteSchema;
};

export const uploadLogoCompleteHandler = async ({
  ctx,
  input,
}: UploadLogoCompleteOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const logoUrl = await getObjectAssetUrl("organization", input.orgId, "logo");
  if (!logoUrl) return;

  const logoHash = await thumbhashFromCdn(logoUrl, 256, 256);

  await ctx.prisma.organization.update({
    where: {
      id: input.orgId,
    },
    data: {
      logoUrl,
      logoHash,
    },
  });
};

export default uploadLogoCompleteHandler;
