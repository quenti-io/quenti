import type { NonNullableUserContext } from "../../../lib/types";
import { getRecentFolders } from "../folders";

type RecentOptions = {
  ctx: NonNullableUserContext;
};

export const recentHandler = async ({ ctx }: RecentOptions) => {
  return await getRecentFolders(ctx.prisma, ctx.session.user.id);
};
