import { Language } from "@quenti/core";

import type { NonNullableUserContext } from "../../lib/types";
import { studySetSelect, termsSelect } from "./queries";

type GetAutosaveOptions = {
  ctx: NonNullableUserContext;
};

export const getAutosaveHandler = async ({ ctx }: GetAutosaveOptions) => {
  let set = await ctx.prisma.studySet.findFirst({
    where: {
      userId: ctx.session.user.id,
      created: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      ...studySetSelect,
      created: true,
      terms: {
        select: termsSelect,
      },
    },
  });

  if (!set) {
    set = await ctx.prisma.studySet.create({
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
        created: true,
        terms: {
          select: termsSelect,
        },
      },
    });
  }

  return {
    ...set,
    user: {
      username: set.user.username,
      image: set.user.image!,
      verified: set.user.verified,
      name: set.user.displayName ? set.user.name : undefined,
    },
    tags: set.tags as string[],
    wordLanguage: set.wordLanguage as Language,
    definitionLanguage: set.definitionLanguage as Language,
  };
};

export default getAutosaveHandler;
