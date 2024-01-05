import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { serialize } from "../terms/utils/serialize";
import type { TAddTermSchema } from "./add-term.schema";

export type AddTermOptions = {
  ctx: NonNullableUserContext;
  input: TAddTermSchema;
};

export const addTermHandler = async ({ ctx, input }: AddTermOptions) => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
      member: {
        userId: ctx.session.user.id,
      },
      assignment: {
        studySetId: input.studySetId,
      },
      submittedAt: null,
    },
    select: {
      id: true,
      assignment: {
        select: {
          studySet: {
            select: {
              collab: {
                select: {
                  type: true,
                  maxTermsPerUser: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  });

  if (!submission) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const collab = submission.assignment.studySet?.collab;
  if (!collab) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  if (
    collab.type == "Default" &&
    submission._count.terms >= (collab.maxTermsPerUser || 0)
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }

  const { plainText: word, richText: wordRichText } = serialize(
    input.term.word,
    input.term.wordRichText,
    // Don't sanitize for unsubmitted terms
    false,
  );
  const { plainText: definition, richText: definitionRichText } = serialize(
    input.term.definition,
    input.term.definitionRichText,
    false,
  );

  // Insert empty terms below the current rank if it is greater than the current max rank
  const merges = [];
  if (input.term.rank > submission._count.terms) {
    await ctx.prisma.term.createMany({
      data: Array(input.term.rank - submission._count.terms)
        .fill(null)
        .map((_, i) => ({
          studySetId: input.studySetId,
          rank: submission._count.terms + i,
          word: "",
          definition: "",
          ephemeral: true,
          authorId: ctx.session.user.id,
          submissionId: submission.id,
        })),
    });

    const created = await ctx.prisma.term.findMany({
      where: {
        studySetId: input.studySetId,
        rank: {
          in: Array(input.term.rank - submission._count.terms)
            .fill(null)
            .map((_, i) => submission._count.terms + i),
        },
      },
      select: {
        id: true,
        rank: true,
      },
    });

    merges.push(...created.map((term) => ({ id: term.id, rank: term.rank })));
  }

  // Censorup all ranks so that all values are consecutive
  await ctx.prisma.term.updateMany({
    where: {
      submissionId: input.submissionId,
      studySetId: input.studySetId,
      rank: {
        gte: input.term.rank,
      },
    },
    data: {
      rank: {
        increment: 1,
      },
    },
  });

  const created = await ctx.prisma.term.create({
    data: {
      studySetId: input.studySetId,
      rank: input.term.rank,
      word,
      definition,
      wordRichText,
      definitionRichText,
      ephemeral: true,
      authorId: ctx.session.user.id,
      submissionId: submission.id,
    },
  });

  return { created, merges };
};

export default addTermHandler;
