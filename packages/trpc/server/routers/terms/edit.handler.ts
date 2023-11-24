import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";
import { serialize } from "./utils/serialize";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
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
    input.word,
    input.wordRichText,
    studySet.created,
  );
  const { plainText: definition, richText: definitionRichText } = serialize(
    input.definition,
    input.definitionRichText,
    studySet.created,
  );

  const term = await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    data: {
      word,
      definition,
      wordRichText,
      definitionRichText,
      studySet: {
        update: {
          cortexStale: true,
        },
      },
    },
  });
  return term;
};

export default editHandler;
