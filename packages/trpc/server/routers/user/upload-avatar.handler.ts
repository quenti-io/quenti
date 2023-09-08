import { getPresignedAvatarUrl } from "@quenti/images/server";

import type { NonNullableUserContext } from "../../lib/types";

type UploadAvatarOptions = {
  ctx: NonNullableUserContext;
};

export const uploadAvatarHandler = async ({ ctx }: UploadAvatarOptions) => {
  return await getPresignedAvatarUrl(ctx.session.user.id);
};

export default uploadAvatarHandler;
