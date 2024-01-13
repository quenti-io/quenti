import { prisma } from "@quenti/prisma";
import { Prisma } from "@quenti/prisma/client";
import type { Exact } from "@quenti/prisma/client/runtime";

import { TRPCError } from "@trpc/server";

export const getSubmissionOrThrow = async <T extends Prisma.SubmissionSelect>(
  submissionId: string,
  userId: string,
  args?: Exact<T, T>,
  termId?: string,
) => {
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
      member: {
        userId,
      },
      submittedAt: null,
      assignment: {
        published: true,
        availableAt: {
          lte: new Date(),
        },
        OR: [
          { lockedAt: null },
          {
            lockedAt: {
              gt: new Date(),
            },
          },
        ],
        studySet: {
          visibility: { not: "Private" },
        },
      },
      ...(termId
        ? {
            terms: {
              some: {
                id: termId,
              },
            },
          }
        : {}),
    },
    select: Prisma.validator<T>()(args ?? ({ id: true } as Exact<T, T>)),
  });

  if (!submission) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  return submission;
};

export const saveSubmisson = async (id: string) => {
  await prisma.$executeRaw`UPDATE Submission SET savedAt = NOW() WHERE id = ${id}`;
};
