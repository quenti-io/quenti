import { TRPCError } from "@trpc/server";

import { MAX_TERM } from "../../common/constants";
import { profanity } from "../../common/profanity";
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
    select: {
      created: true,
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

  const sanitize = (s: string) =>
    studySet.created ? profanity.censor(s.slice(0, MAX_TERM)) : s;

  const data = input.terms.map((term, i) => ({
    word: sanitize(term.word),
    definition: sanitize(term.definition),
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
      ephemeral: false,
    },
    select: {
      id: true,
    },
  });
};

export default bulkAddHandler;
