import { getUserAvatarUrl } from "@quenti/images/server";

import type { NonNullableUserContext } from "../../lib/types";

type UploadAvatarCompleteOptions = {
  ctx: NonNullableUserContext;
};

export const uploadAvatarCompleteHandler = async ({
  ctx,
}: UploadAvatarCompleteOptions) => {
  const url = await getUserAvatarUrl(ctx.session.user.id);
  if (!url) return;

  await ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: { image: url },
  });
};

export default uploadAvatarCompleteHandler;
