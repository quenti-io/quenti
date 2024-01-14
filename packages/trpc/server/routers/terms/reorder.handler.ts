import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import { reorder } from "./mutations/reorder";
import type { TReorderSchema } from "./reorder.schema";

type ReorderOptions = {
  ctx: NonNullableUserContext;
  input: TReorderSchema;
};

export const reorderHandler = async ({ ctx, input }: ReorderOptions) => {
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

  const term = await ctx.prisma.term.findUnique({
    where: {
      id_studySetId: {
        id: input.term.id,
        studySetId: input.studySetId,
      },
    },
  });

  if (!term) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const currentRank = term.rank;

  await ctx.prisma.$transaction(async (prisma) => {
    await prisma.term.updateMany({
      where: {
        studySetId: input.studySetId,
        ephemeral: false,
        rank: {
          gte: Math.min(currentRank, input.term.rank),
          lte: Math.max(currentRank, input.term.rank),
        },
      },
      data: {
        rank: {
          increment: currentRank <= input.term.rank ? -1 : 1,
        },
      },
    });

    // Update the rank of the current term
    await prisma.term.update({
      where: {
        id_studySetId: {
          id: input.term.id,
          studySetId: input.studySetId,
        },
      },
      data: {
        rank: input.term.rank,
      },
    });
  });

  // Needs to be outside of the transaction otherwise breaks
  await reorder(ctx.prisma, input.studySetId);
};

export default reorderHandler;
