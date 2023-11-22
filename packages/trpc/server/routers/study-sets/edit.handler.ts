import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
  if (
    (await ctx.prisma.studySet.findUnique({
      where: {
        id_userId: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        created: true,
      },
    })) &&
    input.title.length < 1
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Set title is required.",
    });
  }

  const studySet = await ctx.prisma.studySet.update({
    where: {
      id_userId: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    },
    data: {
      title: input.title,
      description: input.description,
      tags: input.tags,
      wordLanguage: input.wordLanguage,
      definitionLanguage: input.definitionLanguage,
      visibility: input.visibility,
    },
  });

  return studySet;
};

export default editHandler;
