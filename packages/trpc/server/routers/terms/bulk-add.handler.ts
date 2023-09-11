import { TRPCError } from "@trpc/server";

import { markCortexStale } from "../../lib/cortex";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkAddSchema } from "./bulk-add.schema";

type BulkAddOptions = {
  ctx: NonNullableUserContext;
  input: TBulkAddSchema;
};

export const bulkAddHandler = async ({ ctx, input }: BulkAddOptions) => {
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

  const data = input.terms.map((term, i) => ({
    ...term,
    studySetId: input.studySetId,
    rank: studySet._count.terms + i,
  }));

  await ctx.prisma.term.createMany({
    data,
  });

  await markCortexStale(input.studySetId);

  return await ctx.prisma.term.findMany({
    where: {
      studySetId: input.studySetId,
    },
    select: {
      id: true,
    },
  });
};

export default bulkAddHandler;
