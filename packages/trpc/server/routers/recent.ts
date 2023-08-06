import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getBelongingClasses } from "./classes/utils/get-belonging";
import { getRecentFolders } from "./folders/utils/recent";
import { getRecentStudySets } from "./study-sets/utils/recent";

export const recentRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const sets = await getRecentStudySets(ctx.prisma, ctx.session!.user.id);
    const folders = await getRecentFolders(ctx.prisma, ctx.session!.user.id);
    const classes = await getBelongingClasses(
      ctx.session!.user.id,
      ctx.session!.user.type
    );
    return { sets, folders, classes };
  }),
});
