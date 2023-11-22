import { bulkGenerateDistractors } from "@quenti/cortex/distractors";

import { TRPCError } from "@trpc/server";

import {
  MAX_CHARS_TAGS,
  MAX_DESC,
  MAX_NUM_TAGS,
  MAX_TITLE,
} from "../../common/constants";
import { profanity } from "../../common/profanity";
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
      created: true,
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

  const created = await ctx.prisma.studySet.update({
    where: {
      id: input.id,
    },
    data: {
      created: true,
      title: profanity.censor(autosave.title.slice(0, MAX_TITLE)),
      description: profanity.censor(autosave.description.slice(0, MAX_DESC)),
      tags: (autosave.tags as string[])
        .slice(0, MAX_NUM_TAGS)
        .map((x) => profanity.censor(x.slice(0, MAX_CHARS_TAGS))),
      wordLanguage: autosave.wordLanguage,
      definitionLanguage: autosave.definitionLanguage,
      visibility: autosave.visibility,
      cortexStale: false,
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

  await bulkUpdateTerms(autosave.terms, autosave.id);

  const start = Date.now();

  const distractors = await bulkGenerateDistractors(created.terms);
  await ctx.prisma.distractor.createMany({
    data: distractors.map((d) => ({
      type: d.type == "word" ? "Word" : "Definition",
      termId: d.termId,
      distractingId: d.distractorId,
      studySetId: created.id,
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
