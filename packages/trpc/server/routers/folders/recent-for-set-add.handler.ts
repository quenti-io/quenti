import type { NonNullableUserContext } from "../../lib/types";
import type { TRecentForSetAddSchema } from "./recent-for-set-add.schema";

type RecentForSetAddOptions = {
  ctx: NonNullableUserContext;
  input: TRecentForSetAddSchema;
};

export const recentForSetAddHandler = async ({
  ctx,
  input,
}: RecentForSetAddOptions) => {
  const recent = await ctx.prisma.container.findMany({
    where: {
      userId: ctx.session.user.id,
      type: "Folder",
      folder: {
        userId: ctx.session.user.id,
      },
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 16,
    include: {
      folder: {
        select: {
          id: true,
          title: true,
          slug: true,
          studySets: {
            where: {
              studySetId: input.studySetId,
            },
          },
        },
      },
    },
  });

  return recent.map((r) => ({
    id: r.folder!.id,
    title: r.folder!.title,
    slug: r.folder!.slug,
    includes: r.folder!.studySets.length > 0,
  }));
};

export default recentForSetAddHandler;
