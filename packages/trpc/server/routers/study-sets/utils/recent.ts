import type { PrismaClient } from "@quenti/prisma/client";

export const getRecentStudySets = async (
  prisma: PrismaClient,
  userId: string,
  exclude?: string[],
) => {
  const recentContainers = await prisma.container.findMany({
    where: {
      userId: userId,
      type: "StudySet",
      NOT: {
        OR: [
          {
            entityId: {
              in: exclude ?? [],
            },
          },
          {
            studySet: {
              user: {
                username: "Quizlet",
              },
            },
          },
        ],
      },
      studySet: {
        OR: [
          {
            visibility: {
              not: "Private",
            },
          },
          {
            userId: userId,
          },
        ],
      },
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 16,
  });
  const containerIds = recentContainers.map((e) => e.entityId);

  return (
    await prisma.studySet.findMany({
      where: {
        id: {
          in: containerIds,
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            terms: true,
          },
        },
      },
    })
  )
    .sort((a, b) => containerIds.indexOf(a.id) - containerIds.indexOf(b.id))
    .map((set) => ({
      ...set,
      viewedAt: recentContainers.find((e) => e.entityId === set.id)!.viewedAt,
      user: {
        username: set.user.username,
        image: set.user.image!,
      },
    }));
};
