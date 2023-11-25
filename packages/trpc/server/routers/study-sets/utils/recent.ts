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
        entityId: {
          in: exclude ?? [],
        },
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
    select: {
      entityId: true,
      viewedAt: true,
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
      select: {
        id: true,
        userId: true,
        createdAt: true,
        title: true,
        description: true,
        tags: true,
        visibility: true,
        wordLanguage: true,
        definitionLanguage: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
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
        username: set.user.username!,
        image: set.user.image!,
      },
    }));
};

export const getRecentDrafts = async (prisma: PrismaClient, userId: string) => {
  return (
    await prisma.studySet.findMany({
      where: {
        userId: userId,
        created: false,
        OR: [
          {
            title: {
              not: "",
            },
          },
          {
            terms: {
              some: {
                OR: [
                  {
                    word: {
                      not: "",
                    },
                  },
                  {
                    definition: {
                      not: "",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        savedAt: true,
        createdAt: true,
        tags: true,
        visibility: true,
        wordLanguage: true,
        definitionLanguage: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            terms: true,
          },
        },
      },
      orderBy: {
        savedAt: "desc",
      },
      take: 16,
    })
  ).map((set) => ({
    ...set,
    user: {
      username: set.user.username!,
      image: set.user.image!,
    },
  }));
};
