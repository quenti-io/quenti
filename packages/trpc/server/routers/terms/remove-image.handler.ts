import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveImageSchema } from "./remove-image.schema";

type RemoveImageOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveImageSchema;
};

export const removeImageHandler = async ({
  ctx,
  input,
}: RemoveImageOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  return await ctx.prisma.term.update({
    where: {
      id_studySetId: {
        id: input.id,
        studySetId: input.studySetId,
      },
    },
    data: {
      assetUrl: null,
    },
  });
};

export default removeImageHandler;
