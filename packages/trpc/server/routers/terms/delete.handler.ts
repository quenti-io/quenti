import { env } from "@quenti/env/server";
import { deleteTermAsset } from "@quenti/images/server";

import { TRPCError } from "@trpc/server";

import { markCortexStale } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    include: {
      _count: {
        select: {
          terms: {
            where: {
              ephemeral: false,
            },
          },
        },
      },
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }
  if (studySet._count.terms <= 1) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Set must contain at least one term",
    });
  }

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_studySetId: {
        id: input.termId,
        studySetId: input.studySetId,
      },
      ephemeral: false,
    },
    select: {
      id: true,
      rank: true,
      assetUrl: true,
    },
  });

  if (!term) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  // Update all ranks so that all values are consecutive
  await ctx.prisma.term.updateMany({
    where: {
      studySetId: input.studySetId,
      rank: {
        gt: term.rank,
      },
    },
    data: {
      rank: {
        decrement: 1,
      },
    },
  });

  if (
    env.ASSETS_BUCKET_URL &&
    term.assetUrl?.startsWith(env.ASSETS_BUCKET_URL)
  ) {
    await deleteTermAsset(input.studySetId, term.id);
  }

  await ctx.prisma.term.delete({
    where: {
      id_studySetId: {
        id: input.termId,
        studySetId: input.studySetId,
      },
    },
  });

  await markCortexStale(input.studySetId);

  return { deleted: input.termId };
};

export default deleteHandler;
