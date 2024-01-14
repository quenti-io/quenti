import type { Language } from "@quenti/core";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TGetAutosaveSchema } from "./get-autosave.schema";
import { studySetSelect, termsSelect } from "./queries";

type GetAutosaveOptions = {
  ctx: NonNullableUserContext;
  input: TGetAutosaveSchema;
};

const getAutosaveById = async (
  prisma: NonNullableUserContext["prisma"],
  id: string,
  userId: string,
) => {
  const autosave = await prisma.studySet.findUnique({
    where: {
      id,
      userId,
      created: false,
    },
    select: {
      ...studySetSelect,
      terms: {
        select: termsSelect,
      },
    },
  });

  if (!autosave) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  return autosave;
};

export const getAutosaveHandler = async ({
  ctx,
  input,
}: GetAutosaveOptions) => {
  let autosave = !input.id
    ? await ctx.prisma.studySet.findFirst({
        where: {
          userId: ctx.session.user.id,
          created: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          ...studySetSelect,
          terms: {
            select: termsSelect,
          },
        },
      })
    : await getAutosaveById(ctx.prisma, input.id, ctx.session.user.id);

  if (!autosave) {
    autosave = await ctx.prisma.studySet.create({
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
  }

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

export default getAutosaveHandler;
