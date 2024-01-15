import { Prisma } from "@quenti/prisma/client";

export const collaboratorsSelect =
  Prisma.validator<Prisma.StudySetCollaboratorSelect>()({
    createdAt: true,
    user: {
      select: {
        id: true,
        username: true,
        image: true,
        name: true,
        displayName: true,
      },
    },
  });

export const collabSelect = (userId?: string) =>
  Prisma.validator<Prisma.StudySetCollabSelect>()({
    id: true,
    minTermsPerUser: true,
    maxTermsPerUser: true,
    type: true,
    topics: {
      select: {
        id: true,
        rank: true,
        topic: true,
        description: true,
        assigned: userId
          ? {
              where: {
                member: {
                  userId,
                  deletedAt: null,
                },
              },
              select: {
                id: true,
                minTerms: true,
                maxTerms: true,
              },
            }
          : false,
        maxTerms: true,
        minTerms: true,
      },
    },
  });

export const assignmentArgs = (userId: string) =>
  Prisma.validator<Prisma.StudySet$assignmentArgs>()({
    where: {
      OR: [
        {
          availableAt: { lte: new Date() },
        },
        {
          class: {
            members: {
              some: {
                userId,
                deletedAt: null,
                type: "Teacher",
              },
            },
          },
        },
      ],
      class: {
        members: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
    },
    select: {
      id: true,
      classId: true,
      availableAt: true,
      dueAt: true,
      lockedAt: true,
      title: true,
      description: true,
      type: true,
      published: true,
      class: {
        select: {
          members: {
            where: {
              userId,
              deletedAt: null,
            },
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      submissions: {
        where: {
          member: {
            userId,
            deletedAt: null,
          },
        },
        orderBy: {
          startedAt: "desc",
        },
        take: 1,
        select: {
          startedAt: true,
          submittedAt: true,
        },
      },
    },
  });

export const collabTermsSelect = Prisma.validator<Prisma.TermSelect>()({
  authorId: true,
  topicId: true,
});
