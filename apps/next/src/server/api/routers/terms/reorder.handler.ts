import { Prisma } from "@quenti/prisma/client";
import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../../lib/types";
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

    // Sort all of the terms by rank, and update the ranks to be consecutive
    const terms = await prisma.term.findMany({
      where: {
        studySetId: input.studySetId,
      },
      orderBy: {
        rank: "asc",
      },
    });

    const vals = terms.map((term, i) => [
      term.id,
      term.studySetId,
      term.word,
      term.definition,
      i,
    ]);
    const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);

    const query = Prisma.sql`
    INSERT INTO Term (id, studySetId, word, definition, \`rank\`)
    VALUES ${Prisma.join(formatted)}
    ON DUPLICATE KEY UPDATE Term.\`rank\` = VALUES(\`rank\`)
  `;

    await prisma.$executeRaw(query);
  });
};

export default reorderHandler;
