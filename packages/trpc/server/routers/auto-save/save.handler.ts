import { nanoid } from "nanoid";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSaveSchema } from "./save.schema";

type SaveOptions = {
  ctx: NonNullableUserContext;
  input: TSaveSchema;
};

export const saveHandler = async ({ ctx, input }: SaveOptions) => {
  const terms = input.terms.map((t) => ({ ...t, id: nanoid() }));

  return await ctx.prisma.setAutoSave.upsert({
    where: {
      userId: ctx.session.user.id,
    },
    update: {
      title: input.title,
      description: input.description,
      tags: input.tags,
      wordLanguage: input.wordLanguage,
      definitionLanguage: input.definitionLanguage,
      visibility: input.visibility,
      userId: ctx.session.user.id,
      autoSaveTerms: {
        deleteMany: { setAutoSaveId: ctx.session.user.id },
        createMany: {
          data: terms.map((term, i) => ({
            id: term.id,
            definition: term.definition,
            word: term.word,
            rank: i,
          })),
        },
      },
    },
    create: {
      title: input.title,
      description: input.description,
      tags: input.tags,
      wordLanguage: input.wordLanguage,
      definitionLanguage: input.definitionLanguage,
      visibility: input.visibility,
      userId: ctx.session.user.id,
      autoSaveTerms: {
        createMany: {
          data: terms.map((term, i) => ({
            id: term.id,
            definition: term.definition,
            word: term.word,
            rank: i,
          })),
        },
      },
    },
  });
};

export default saveHandler;
