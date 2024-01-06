import { TRPCError } from "@trpc/server";

import { markCortexStale } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkEditSchema } from "./bulk-edit.schema";
import { bulkUpdateTerms } from "./mutations/update";
import { serialize } from "./utils/serialize";

type BulkEditOptions = {
  ctx: NonNullableUserContext;
  input: TBulkEditSchema;
};

export const bulkEditHandler = async ({ ctx, input }: BulkEditOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
      created: true,
      terms: {
        where: {
          ephemeral: false,
          id: {
            in: input.terms.map((term) => term.id),
          },
        },
        select: {
          id: true,
          rank: true,
        },
      },
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const terms = studySet.terms.map((term) => {
    const t = input.terms.find((t) => t.id === term.id);
    if (!t) throw new TRPCError({ code: "BAD_REQUEST" });

    const { plainText: word, richText: wordRichText } = serialize(
      t.word,
      t.wordRichText,
      studySet.created,
      true,
    );
    const { plainText: definition, richText: definitionRichText } = serialize(
      t.definition,
      t.definitionRichText,
      studySet.created,
      true,
    );

    return {
      ...term,
      word,
      wordRichText,
      definition,
      definitionRichText,
    };
  });

  await bulkUpdateTerms(terms, studySet.id);

  await markCortexStale(input.studySetId);
};

export default bulkEditHandler;
