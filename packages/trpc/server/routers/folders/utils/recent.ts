import type { PrismaClient } from "@quenti/prisma/client";

export const getRecentFolders = async (
  prisma: PrismaClient,
  userId: string,
  exclude?: string[],
) => {
  const recentContainers = await prisma.container.findMany({
    where: {
      userId,
      type: "Folder",
      NOT: {
        entityId: {
          in: exclude ?? [],
        },
      },
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
            studySets: {
              where: {
                studySet: {
                  OR: [
                    { visibility: "Public" },
                    { visibility: "Unlisted" },
                    {
                      AND: [
                        { visibility: "Class" },
                        {
                          classesWithAccess: {
                            some: {
                              class: {
                                members: {
                                  some: {
                                    userId,
                                    deletedAt: null,
                                  },
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                    { userId },
                  ],
                },
              },
            },
          },
        },
      },
    })
  ).map((x) => ({
    ...x,
    viewedAt: recentContainers.find((e) => e.entityId === x.id)!.viewedAt,
    user: {
      username: x.user.username!,
      image: x.user.image,
    },
  }));
};
