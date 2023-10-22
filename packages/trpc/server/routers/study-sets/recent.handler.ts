import type { NonNullableUserContext } from "../../lib/types";
import type { TRecentSchema } from "./recent.schema";
import { getRecentStudySets } from "./utils/recent";

type RecentOptions = {
  ctx: NonNullableUserContext;
  input: TRecentSchema;
};

export const recentHandler = async ({ ctx, input }: RecentOptions) => {
  return await getRecentStudySets(
    ctx.prisma,
    ctx.session.user.id,
    input.exclude,
  );
};

export default recentHandler;
