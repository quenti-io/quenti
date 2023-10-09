import { TRPCError } from "@trpc/server";

import { shortId } from "../../common/generator";
import type { DefaultContext } from "../../lib/types";
import type { TGetShareIdSchema } from "./get-share-id.schema";

type GetShareIdOptions = {
  ctx: DefaultContext;
  input: TGetShareIdSchema;
};

export const getShareIdHandler = async ({ ctx, input }: GetShareIdOptions) => {
  if (input.folderId) {
    const folder = await ctx.prisma.folder.findUnique({
      where: {
        id: input.folderId,
      },
    });

    if (!folder) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return (
      await ctx.prisma.entityShare.upsert({
        where: {
          entityId: input.folderId,
        },
        create: {
          entityId: input.folderId,
          id: shortId.rnd(),
          type: "Folder",
        },
        update: {},
      })
    ).id;
  } else if (input.username && input.idOrSlug) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        username: input.username,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const folder = await ctx.prisma.folder.findFirst({
      where: {
        OR: [
          {
            userId: user.id,
            slug: input.idOrSlug,
          },
          {
            userId: user.id,
            id: input.idOrSlug,
          },
        ],
      },
    });

    if (!folder) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return (
      await ctx.prisma.entityShare.upsert({
        where: {
          entityId: folder.id,
        },
        create: {
          entityId: folder.id,
          id: shortId.rnd(),
          type: "Folder",
        },
        update: {},
      })
    ).id;
  }

  // Schema validation should prevent this from happening
  throw new TRPCError({
    code: "BAD_REQUEST",
  });
};

export default getShareIdHandler;
