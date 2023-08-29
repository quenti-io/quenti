import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const term = await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    data: {
      word: input.word,
      definition: input.definition,
      studySet: {
        update: {
          cortexStale: true,
        },
      },
    },
  });
  return term;
};

export default editHandler;
