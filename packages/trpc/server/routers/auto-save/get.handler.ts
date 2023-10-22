import { nanoid } from "nanoid";

import { type Language } from "@quenti/core";

import type { NonNullableUserContext } from "../../lib/types";

type GetOptions = {
  ctx: NonNullableUserContext;
};

export const getHandler = async ({ ctx }: GetOptions) => {
  const autoSave = await ctx.prisma.setAutoSave.upsert({
    where: {
      userId: ctx.session.user.id,
    },
    update: {},
    create: {
      title: "",
      description: "",
      userId: ctx.session.user.id,
      autoSaveTerms: {
        createMany: {
          data: Array.from({ length: 5 }).map((_, i) => ({
            id: nanoid(),
            word: "",
            definition: "",
            rank: i,
          })),
        },
      },
    },
    include: {
      autoSaveTerms: true,
    },
  });

  return {
    ...autoSave,
    tags: autoSave.tags as string[],
    wordLanguage: autoSave.wordLanguage as Language,
    definitionLanguage: autoSave.definitionLanguage as Language,
  };
};

export default getHandler;
