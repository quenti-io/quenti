import { Prisma } from "@quenti/prisma/client";

export const collaboratorsSelect =
  Prisma.validator<Prisma.StudySetCollaboratorSelect>()({
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
      class: {
        members: {
          some: {
            userId,
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
      submissions: {
        where: {
          member: {
            userId,
          },
        },
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
