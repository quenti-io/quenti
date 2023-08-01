import { TRPCError } from "@trpc/server";
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
          terms: true,
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

  await ctx.prisma.term.delete({
    where: {
      id_studySetId: {
        id: input.termId,
        studySetId: input.studySetId,
      },
    },
  });

  return { deleted: input.termId };
};

export default deleteHandler;
