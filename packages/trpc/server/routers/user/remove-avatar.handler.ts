import { env } from "@quenti/env/client";

import type { NonNullableUserContext } from "../../lib/types";

type RemoveAvatarOptions = {
  ctx: NonNullableUserContext;
};

export const removeAvatarHandler = async ({ ctx }: RemoveAvatarOptions) => {
  const index = Math.floor(Math.random() * 5);
  const image = `${env.NEXT_PUBLIC_APP_URL}/avatars/default/${index}.png`;

  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      image,
    },
  });

  return { image };
};

export default removeAvatarHandler;
