import type { Language } from "@quenti/core";

import { TRPCError } from "@trpc/server";

import type { DefaultContext } from "../../lib/types";
import type { TGetPublicSchema } from "./get-public.schema";

type GetPublicOptions = {
  ctx: DefaultContext;
  input: TGetPublicSchema;
};

export const getPublicHandler = async ({ ctx, input }: GetPublicOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id: input.studySetId,
    },
    include: {
      user: true,
      terms: true,
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (studySet.visibility !== "Public") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return {
    ...studySet,
    tags: studySet.tags as string[],
    wordLanguage: studySet.wordLanguage as Language,
    definitionLanguage: studySet.definitionLanguage as Language,
    user: {
      username: studySet.user.username,
      image: studySet.user.image!,
      verified: studySet.user.verified,
    },
  };
};

export default getPublicHandler;
