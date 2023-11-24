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

  // Censorup all ranks so that all values are consecutive
  await ctx.prisma.term.updateMany({
    where: {
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
    },
  });

  await markCortexStale(input.studySetId);

  return created;
};

export default addHandler;
