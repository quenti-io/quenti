import type { Language } from "@quenti/core";

import type { NonNullableUserContext } from "../../lib/types";
import { studySetSelect, termsSelect } from "./queries";

type CreateAutosaveOptions = {
  ctx: NonNullableUserContext;
};

export const createAutosaveHandler = async ({ ctx }: CreateAutosaveOptions) => {
  const autosave = await ctx.prisma.studySet.create({
    data: {
      title: "",
      description: "",
      userId: ctx.session.user.id,
      created: false,
      terms: {
        createMany: {
          data: Array.from({ length: 5 }).map((_, i) => ({
            word: "",
            definition: "",
            rank: i,
          })),
        },
      },
    },
    select: {
      ...studySetSelect,
      terms: {
        select: termsSelect,
      },
    },
  });

  return {
    ...autosave,
    user: {
      username: autosave.user.username,
      image: autosave.user.image!,
      verified: autosave.user.verified,
      name: autosave.user.displayName ? autosave.user.name : undefined,
    },
    tags: autosave.tags as string[],
    wordLanguage: autosave.wordLanguage as Language,
    definitionLanguage: autosave.definitionLanguage as Language,
  };
};

export default createAutosaveHandler;
