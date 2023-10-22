import slugify from "slugify";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
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

  const slug = slugify(input.title, { lower: true });
  const existing = await ctx.prisma.folder.findUnique({
    where: {
      userId_slug: {
        userId: ctx.session.user.id,
        slug,
      },
    },
  });

  return await ctx.prisma.folder.update({
    where: {
      id: input.folderId,
    },
    data: {
      title: input.title,
      description: input.description,
      slug: !existing || existing.id == input.folderId ? slug : null,
    },
  });
};

export default editHandler;
