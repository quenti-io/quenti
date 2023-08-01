import type { PrismaClient } from "@quenti/prisma/client";

export const getRecentFolders = async (
  prisma: PrismaClient,
  userId: string
) => {
  const recentContainers = await prisma.container.findMany({
    where: {
      userId,
      type: "Folder",
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 16,
  });
  const entityIds = recentContainers.map((e) => e.entityId);

  return (
    await prisma.folder.findMany({
      where: {
        id: {
          in: entityIds,
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            studySets: true,
          },
        },
      },
    })
  ).map((x) => ({
    ...x,
    viewedAt: recentContainers.find((e) => e.entityId === x.id)!.viewedAt,
    user: {
      username: x.user.username,
      image: x.user.image,
    },
  }));
};
