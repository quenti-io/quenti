import { getObjectAssetUrl } from "@quenti/images/server";
import { thumbhashFromCdn } from "@quenti/images/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
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
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const logoUrl = await getObjectAssetUrl("class", input.classId, "logo");
  if (!logoUrl) return;

  const logoHash = await thumbhashFromCdn(logoUrl, 256, 256);

  await ctx.prisma.class.update({
    where: {
      id: input.classId,
    },
    data: {
      logoUrl,
      logoHash,
    },
  });
};

export default uploadLogoCompleteHandler;
