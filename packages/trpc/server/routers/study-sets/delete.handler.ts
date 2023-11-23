import { env } from "@quenti/env/server";
import { deleteStudySetAssets } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id_userId: {
        id: input.studySetId,
        userId: ctx.session.user.id,
      },
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

  const termWithCdnAsset = await ctx.prisma.term.findFirst({
    where: {
      studySetId: input.studySetId,
      AND: {
        assetUrl: {
          startsWith: env.ASSETS_BUCKET_URL,
        },
      },
    },
  });

  if (termWithCdnAsset) {
    await deleteStudySetAssets(studySet.id);
  }

  return await ctx.prisma.studySet.delete({
    where: {
      id: input.studySetId,
    },
  });
};

export default deleteHandler;
