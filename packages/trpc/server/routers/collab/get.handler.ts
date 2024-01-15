import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { collabTermsSelect, termsSelect } from "../study-sets/queries";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id: input.studySetId,
      assignment: {
        type: "Collab",
        section: {
          students: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
      visibility: {
        not: "Private",
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      wordLanguage: true,
      definitionLanguage: true,
      collab: {
        select: {
          type: true,
          minTermsPerUser: true,
          maxTermsPerUser: true,
        },
      },
      assignment: {
        where: {
          published: true,
          availableAt: {
            lte: new Date(),
          },
        },
        select: {
          id: true,
          dueAt: true,
          lockedAt: true,
          class: {
            select: {
              members: {
                where: {
                  userId: ctx.session.user.id,
                  deletedAt: null,
                },
                select: {
                  id: true,
                },
              },
            },
          },
          _count: {
            select: {
              submissions: {
                where: {
                  member: {
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!studySet || !studySet.assignment) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const memberId = studySet.assignment.class.members[0]?.id;
  const collab = studySet.collab;
  if (!memberId || !collab) throw new TRPCError({ code: "NOT_FOUND" });

  const isLocked =
    studySet.assignment.lockedAt && studySet.assignment.lockedAt <= new Date();

  if (!studySet.assignment._count.submissions) {
    // Don't create any new submissions for a locked assignment
    if (isLocked) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    // Create a submission for the user to start
    await ctx.prisma.submission.create({
      data: {
        assignmentId: studySet.assignment.id,
        memberId,
        terms: {
          createMany: {
            data: Array.from({ length: collab.minTermsPerUser || 3 }).map(
              (_, i) => ({
                word: "",
                definition: "",
                authorId: ctx.session.user.id,
                studySetId: input.studySetId,
                ephemeral: true,
                rank: i,
              }),
            ),
          },
        },
      },
    });
  }

  const submission = await ctx.prisma.submission.findFirstOrThrow({
    where: {
      assignmentId: studySet.assignment.id,
      member: {
        userId: ctx.session.user.id,
      },
    },
    select: {
      id: true,
      startedAt: true,
      savedAt: true,
      submittedAt: true,
      terms: {
        select: {
          ...termsSelect,
          ...collabTermsSelect,
        },
      },
    },
    take: 1,
    orderBy: {
      startedAt: "desc",
    },
  });

  return {
    ...studySet,
    submission,
  };
};

export default getHandler;
