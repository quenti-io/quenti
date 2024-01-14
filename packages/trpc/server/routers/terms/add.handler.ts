import { TRPCError } from "@trpc/server";

import { markCortexStale } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddSchema } from "./add.schema";
import { serialize } from "./utils/serialize";

type AddOptions = {
  ctx: NonNullableUserContext;
  input: TAddSchema;
};

export const addHandler = async ({ ctx, input }: AddOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    select: {
      created: true,
      _count: {
        select: {
          terms: {
            where: {
              ephemeral: false,
            },
          },
        },
      },
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const { plainText: word, richText: wordRichText } = serialize(
    input.term.word,
    input.term.wordRichText,
    studySet.created,
  );
  const { plainText: definition, richText: definitionRichText } = serialize(
    input.term.definition,
    input.term.definitionRichText,
    studySet.created,
  );

  // Insert empty terms below the current rank if it is greater than the current max rank
  const merges = [];
  if (input.term.rank > studySet._count.terms) {
    await ctx.prisma.term.createMany({
      data: Array(input.term.rank - studySet._count.terms)
        .fill(null)
        .map((_, i) => ({
          studySetId: input.studySetId,
          rank: studySet._count.terms + i,
          word: "",
          definition: "",
        })),
    });

    const created = await ctx.prisma.term.findMany({
      where: {
        studySetId: input.studySetId,
        ephemeral: false,
        rank: {
          in: Array(input.term.rank - studySet._count.terms)
            .fill(null)
            .map((_, i) => studySet._count.terms + i),
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
      studySetId: input.studySetId,
      rank: {
        gte: input.term.rank,
      },
      ephemeral: false,
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
    },
  });

  await markCortexStale(input.studySetId);

  return { created, merges };
};

export default addHandler;
