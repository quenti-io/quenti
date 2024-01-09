import { shuffleArray } from "@quenti/lib/array";
import { Prisma } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetShuffleLearnSchema } from "./set-shuffle-learn.schema";

type SetShuffleLearnOptions = {
  ctx: NonNullableUserContext;
  input: TSetShuffleLearnSchema;
};

export const setShuffleLearnHandler = async ({
  ctx,
  input,
}: SetShuffleLearnOptions) => {
  const container = await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      shuffleLearn: input.shuffleLearn,
    },
  });

  if (!container) throw new TRPCError({ code: "NOT_FOUND" });

  if (input.shuffleLearn) {
    const termIds = (
      await ctx.prisma.term.findMany({
        where: { studySetId: input.entityId, ephemeral: false },
        select: { id: true },
      })
    ).map((x) => x.id);

    const shuffledIds = shuffleArray(termIds);
    const vals = shuffledIds.map((id, i) => [
      ctx.session.user.id,
      id,
      container.id,
      0,
      i,
    ]);
    const formatted = vals.map((x) => Prisma.sql`(${Prisma.join(x)})`);

    const query = Prisma.sql`
      INSERT INTO StudiableTerm (userId, termId, containerId, correctness, studiableRank)
      VALUES ${Prisma.join(formatted)}
      ON DUPLICATE KEY UPDATE studiableRank = VALUES(studiableRank);
      `;

    await ctx.prisma.$executeRaw(query);
  } else {
    await ctx.prisma.studiableTerm.updateMany({
      // Using half of the composite primary key
      where: {
        userId: ctx.session.user.id,
        containerId: container.id,
      },
      data: {
        studiableRank: null,
      },
    });
  }
};

export default setShuffleLearnHandler;
