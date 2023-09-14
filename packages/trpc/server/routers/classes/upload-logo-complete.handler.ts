import { getClassAssetUrl } from "@quenti/images/server";

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

  const logoUrl = await getClassAssetUrl(input.classId, "logo");
  if (!logoUrl) return;

  await ctx.prisma.class.update({
    where: {
      id: input.classId,
    },
    data: {
      logoUrl,
    },
  });
};

export default uploadLogoCompleteHandler;
