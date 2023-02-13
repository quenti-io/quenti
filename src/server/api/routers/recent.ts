import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getRecentFolders } from "./folders";
import { getRecentStudySets } from "./study-sets";

export const recentRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const sets = await getRecentStudySets(ctx.prisma, ctx.session?.user?.id);
    const folders = await getRecentFolders(ctx.prisma, ctx.session?.user?.id);
    return { sets, folders };
  }),
});
