import { bulkGenerateDistractors } from "@quenti/cortex/distractors";

import { TRPCError } from "@trpc/server";

import {
  MAX_CHARS_TAGS,
  MAX_DESC,
  MAX_NUM_TAGS,
  MAX_TERM,
  MAX_TITLE,
} from "../../common/constants";
import { censorRichText, profanity } from "../../common/profanity";
import type { NonNullableUserContext } from "../../lib/types";
import { bulkUpdateTerms } from "../terms/mutations/update";
import type { TCreateSchema } from "./create.schema";
import { studySetSelect, termsSelect } from "./queries";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const autosave = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.id,
      userId: ctx.session.user.id,
      created: false,
    },
    select: {
      ...studySetSelect,
      terms: {
        select: termsSelect,
      },
    },
  });

  if (!autosave || autosave.created) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (!autosave.title.trim().length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Set title is required.",
    });
  }

  const blankTerms = autosave.terms.filter(
    (term) => !term.word.trim().length && !term.definition.trim().length,
  );
  if (autosave.terms.length - blankTerms.length < 2) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least two terms are required.",
    });
  }

  const creatableTerms = autosave.terms.filter(
    (t) => !blankTerms.find((b) => b.id === t.id),
  );

  const created = await ctx.prisma.studySet.update({
    where: {
      id: input.id,
    },
    data: {
      created: true,
      createdAt: new Date(),
      title: profanity.censor(autosave.title.slice(0, MAX_TITLE)),
      description: profanity.censor(autosave.description.slice(0, MAX_DESC)),
      tags: (autosave.tags as string[])
        .slice(0, MAX_NUM_TAGS)
        .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
      wordLanguage: autosave.wordLanguage,
      definitionLanguage: autosave.definitionLanguage,
      visibility: autosave.visibility,
      cortexStale: false,
      terms: {
        deleteMany: {
          id: {
            in: blankTerms.map((term) => term.id),
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      visibility: true,
      terms: {
        select: {
          id: true,
          word: true,
          definition: true,
        },
      },
    },
  });

  const terms = creatableTerms.map((term) => {
    return {
      ...term,
      word: profanity.censor(term.word.slice(0, MAX_TERM)),
      definition: profanity.censor(term.definition.slice(0, MAX_TERM)),
      wordRichText: term.wordRichText
        ? censorRichText(term.wordRichText as object)
        : null,
      definitionRichText: term.definitionRichText
        ? censorRichText(term.definitionRichText as object)
        : null,
    };
  });

  await bulkUpdateTerms(terms, autosave.id);

  const start = Date.now();

  const distractors = await bulkGenerateDistractors(created.terms);
  await ctx.prisma.distractor.createMany({
    data: distractors.map((d) => ({
      type: d.type == "word" ? "Word" : "Definition",
      termId: d.termId,
      distractingId: d.distractorId,
    })),
  });

  ctx.req.log.debug("cortex.bulkGenerateDistractors", {
    studySetId: created.id,
    terms: created.terms.length,
    distractors: distractors.length,
    batches: Math.ceil(created.terms.length / 96),
    elapsed: Date.now() - start,
  });

  return created;
};

export default createHandler;
