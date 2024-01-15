import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkDeleteSchema } from "./bulk-delete.schema";
import { reorder } from "./mutations/reorder";

type BulkDeleteOptions = {
  ctx: NonNullableUserContext;
  input: TBulkDeleteSchema;
};

export const bulkDeleteHandler = async ({ ctx, input }: BulkDeleteOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id_userId: {
        id: input.studySetId,
        userId: ctx.session.user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!studySet) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  await ctx.prisma.term.deleteMany({
    where: {
      studySetId: studySet.id,
      ephemeral: false,
      id: {
        in: input.terms,
      },
    },
  });

  await reorder(ctx.prisma, input.studySetId);
};

export default bulkDeleteHandler;
