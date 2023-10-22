import z from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const shareResolverRouter = createTRPCRouter({
  query: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const entityShare = await ctx.prisma.entityShare.findFirst({
      where: {
        id: input,
      },
    });

    if (!entityShare) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    if (entityShare.type == "StudySet") {
      return { url: `/${entityShare.entityId}` };
    } else {
      const folder = await ctx.prisma.folder.findUnique({
        where: {
          id: entityShare.entityId,
        },
        include: {
          user: true,
        },
      });

      if (!folder) {
        return { url: undefined, type: "folder" };
      }

      return {
        url: `/@${folder.user.username}/folders/${folder.slug ?? folder.id}`,
      };
    }
  }),
});
