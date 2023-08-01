import { TRPCError } from "@trpc/server";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddSchema } from "./add.schema";
import { nanoid } from "nanoid";

type AddOptions = {
  ctx: NonNullableUserContext;
  input: TAddSchema;
};

export const addHandler = async ({ ctx, input }: AddOptions) => {
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

  // censorup all ranks so that all values are consecutive
  await ctx.prisma.term.updateMany({
    where: {
      studySetId: input.studySetId,
      rank: {
        gte: input.term.rank,
      },
    },
    data: {
      rank: {
        increment: 1,
      },
    },
  });

  return await ctx.prisma.term.create({
    data: {
      ...input.term,
      id: nanoid(),
      studySetId: input.studySetId,
    },
  });
};

export default addHandler;
