import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { collabTermsSelect, termsSelect } from "../study-sets/queries";
import type { TNewAttemptSchema } from "./new-attempt.schema";

type NewAttemptOptions = {
  ctx: NonNullableUserContext;
  input: TNewAttemptSchema;
};

export const newAttemptHandler = async ({ ctx, input }: NewAttemptOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id: input.studySetId,
      assignment: {
        type: "Collab",
        published: true,
        section: {
          students: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    },
    select: {
      assignment: {
        select: {
          id: true,
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
          submissions: {
            where: {
              member: {
                userId: ctx.session.user.id,
              },
              submittedAt: {
                not: null,
              },
            },
            orderBy: {
              startedAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              terms: {
                select: {
                  ...termsSelect,
                  ...collabTermsSelect,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!studySet || !studySet.assignment)
    throw new TRPCError({ code: "NOT_FOUND" });

  if (
    studySet.assignment.lockedAt &&
    studySet.assignment.lockedAt <= new Date()
  ) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Assignment is locked",
    });
  }

  const memberId = studySet.assignment.class.members[0]?.id;
  if (!memberId) throw new TRPCError({ code: "NOT_FOUND" });

  const submission = studySet.assignment.submissions[0];
  if (!submission) throw new TRPCError({ code: "NOT_FOUND" });

  // TODO: handle submission dates
  await ctx.prisma.submission.create({
    data: {
      assignmentId: studySet.assignment.id,
      memberId,
      terms: {
        createMany: {
          data: submission.terms
            .sort((a, b) => a.rank - b.rank)
            .map((term, i) => ({
              ...term,
              rank: i,
              id: undefined,
              authorId: ctx.session.user.id,
              wordRichText: term.wordRichText ?? undefined,
              definitionRichText: term.definitionRichText ?? undefined,
              ephemeral: true,
            })),
        },
      },
    },
  });
};

export default newAttemptHandler;
