import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import { profanity } from "../../common/profanity";
import {
  MAX_CHARS_TAGS,
  MAX_DESC,
  MAX_NUM_TAGS,
  MAX_TERM,
  MAX_TITLE,
} from "../../common/constants";

type CreateFromAutosaveOptions = {
  ctx: NonNullableUserContext;
};

export const createFromAutosaveHandler = async ({
  ctx,
}: CreateFromAutosaveOptions) => {
  const autoSave = await ctx.prisma.setAutoSave.findFirst({
    where: {
      userId: ctx.session.user.id,
    },
    include: {
      autoSaveTerms: true,
    },
  });

  if (!autoSave) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (!autoSave.title.trim().length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Set title is required.",
    });
  }

  await ctx.prisma.setAutoSave.delete({
    where: {
      userId: ctx.session.user.id,
    },
  });

  const tags = autoSave.tags as string[];
  const studySet = await ctx.prisma.studySet.create({
    data: {
      title: profanity.censor(autoSave.title.slice(0, MAX_TITLE)),
      description: profanity.censor(autoSave.description.slice(0, MAX_DESC)),
      tags: tags
        .slice(0, MAX_NUM_TAGS)
        .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
      wordLanguage: autoSave.wordLanguage,
      definitionLanguage: autoSave.definitionLanguage,
      visibility: autoSave.visibility,
      userId: ctx.session.user.id,
      terms: {
        createMany: {
          data: autoSave.autoSaveTerms.map((term) => ({
            id: term.id,
            word: profanity.censor(term.word.slice(0, MAX_TERM)),
            definition: profanity.censor(term.definition.slice(0, MAX_TERM)),
            rank: term.rank,
          })),
        },
      },
    },
  });

  return studySet;
};

export default createFromAutosaveHandler;
