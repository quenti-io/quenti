import { Prisma } from "@quenti/prisma/client";
import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkEditSchema } from "./bulk-edit.schema";

type BulkEditOptions = {
  ctx: NonNullableUserContext;
  input: TBulkEditSchema;
};

export const bulkEditHandler = async ({ ctx, input }: BulkEditOptions) => {
  const studySet = await ctx.prisma.studySet.findFirst({
    where: {
      id: input.studySetId,
      userId: ctx.session.user.id,
    },
    include: {
      terms: {
        where: {
          id: {
            in: input.terms.map((term) => term.id),
          },
        },
        select: {
          id: true,
          rank: true,
        },
      },
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const terms = studySet.terms.map((term) => ({
    ...term,
    ...input.terms.find((t) => t.id === term.id),
  }));

  const vals = terms.map((term) => [
    term.id,
    term.word,
    term.definition,
    term.rank,
    studySet.id,
  ]);

  const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);
  const query = Prisma.sql`
    INSERT INTO Term (id, word, definition, \`rank\`, studySetId)
    VALUES ${Prisma.join(formatted)}
    ON DUPLICATE KEY UPDATE word = VALUES(word), definition = VALUES(definition)
  `;

  await ctx.prisma.$executeRaw(query);
};

export default bulkEditHandler;
