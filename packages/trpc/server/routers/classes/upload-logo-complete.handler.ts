import { getClassAssetUrl, getResizedUrl } from "@quenti/images/server";

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
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  const url = await getClassAssetUrl(input.classId, "logo");
  if (!url) return;

  const logoUrl = getResizedUrl(url, { width: 128, height: 128, fit: "cover" });

  await ctx.prisma.class.update({
    where: {
      id: input.classId,
    },
    data: {
      logoUrl,
    },
  });
};
