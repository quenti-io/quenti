import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkAddCollabTopicsSchema } from "./bulk-add-collab-topics.schema";

type BulkAddCollabTopicsHandler = {
  ctx: NonNullableUserContext;
  input: TBulkAddCollabTopicsSchema;
};

export const bulkAddCollabTopicsHandler = async ({
  ctx,
  input,
}: BulkAddCollabTopicsHandler) => {
  const collab = await ctx.prisma.studySetCollab.findFirst({
    where: {
      id: input.collabId,
      studySet: {
        userId: ctx.session.user.id,
      },
    },
    select: {
      type: true,
      _count: {
        select: {
          topics: true,
        },
      },
    },
  });

  if (!collab) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }
  if (collab.type !== "Topic")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Topics can only be added to Topic collab sets",
    });

  const data = input.topics.map((topic, i) => ({
    ...topic,
    collabId: input.collabId,
    rank: collab._count.topics + i,
  }));

  await ctx.prisma.studySetCollabTopic.createMany({
    data,
  });

  return await ctx.prisma.studySetCollabTopic.findMany({
    where: {
      collabId: input.collabId,
    },
    select: {
      id: true,
      minTerms: true,
      maxTerms: true,
      topic: true,
      description: true,
      rank: true,
    },
  });
};
