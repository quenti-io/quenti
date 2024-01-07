import { prisma } from "@quenti/prisma";

import { TRPCError } from "@trpc/server";

export const getSubmissionOrThrow = async (
  submissionId: string,
  userId: string,
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
      },
    },
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
