import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TRemoveSetSchema } from "./remove-set.schema";

type RemoveSetOptions = {
  ctx: NonNullableUserContext;
  input: TRemoveSetSchema;
};

export const removeSetHandler = async ({ ctx, input }: RemoveSetOptions) => {
  const folder = await ctx.prisma.folder.findFirst({
    where: {
      userId: ctx.session.user.id,
      id: input.folderId,
    },
  });

  if (!folder) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  await ctx.prisma.studySetsOnFolders.delete({
    where: {
      studySetId_folderId: {
        studySetId: input.studySetId,
        folderId: input.folderId,
      },
    },
  });
};

export default removeSetHandler;
