import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TAddSetsSchema } from "./add-sets.schema";

type AddSetsOptions = {
  ctx: NonNullableUserContext;
  input: TAddSetsSchema;
};

export const addSetsHandler = async ({ ctx, input }: AddSetsOptions) => {
  const folder = await ctx.prisma.folder.findUnique({
    where: {
      id: input.folderId,
    },
    include: {
      studySets: {
        select: {
          studySetId: true,
        },
      },
    },
  });

  if (!folder || folder.userId !== ctx.session.user.id) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const studySets = await ctx.prisma.studySet.findMany({
    where: {
      id: {
        in: input.studySetIds,
        notIn: folder.studySets.map((x) => x.studySetId),
      },
    },
    select: {
      id: true,
      userId: true,
      visibility: true,
      created: true,
    },
  });

  if (studySets.find((x) => !x.created)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot add drafts to a folder",
    });
  }
  if (
    studySets.find(
      (x) => x.visibility == "Private" && x.userId !== ctx.session.user.id,
    )
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot add other users' private study sets to a folder",
    });
  }

  await ctx.prisma.studySetsOnFolders.createMany({
    data: studySets.map((s) => ({
      folderId: input.folderId,
      studySetId: s.id,
    })),
  });
};

export default addSetsHandler;
