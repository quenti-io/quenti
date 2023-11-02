import { getPlainText, getRichTextJson } from "@quenti/lib/editor";
import { Prisma } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { MAX_TERM } from "../../common/constants";
import { censorRichText, profanity } from "../../common/profanity";
import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";

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
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  let word = input.word;
  let definition = input.definition;
  let wordRichText = null;
  let definitionRichText = null;

  if (input.wordRichText) {
    const json = getRichTextJson(input.wordRichText);
    const plainText = getPlainText(json);
    word = plainText;
    wordRichText = json;
  }
  if (input.definitionRichText) {
    const json = getRichTextJson(input.definitionRichText);
    const plainText = getPlainText(json);
    definition = plainText;
    definitionRichText = json;
  }

  word = profanity.censor(word.slice(0, MAX_TERM));
  definition = profanity.censor(definition.slice(0, MAX_TERM));

  wordRichText = wordRichText
    ? (censorRichText(wordRichText) as object)
    : Prisma.JsonNull;
  definitionRichText = definitionRichText
    ? (censorRichText(definitionRichText) as object)
    : Prisma.JsonNull;

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
