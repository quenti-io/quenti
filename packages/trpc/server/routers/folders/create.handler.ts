import slugify from "slugify";

import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const slug = slugify(input.title, { lower: true });
  const existing = await ctx.prisma.folder.findUnique({
    where: {
      userId_slug: {
        userId: ctx.session.user.id,
        slug,
      },
    },
  });

  if (input.setId) {
    const set = await ctx.prisma.studySet.findUnique({
      where: {
        id: input.setId,
      },
    });

    if (!set) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (set.visibility === "Private" && set.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot add another user's private set to a folder",
      });
    }
  }

  return await ctx.prisma.folder.create({
    data: {
      title: input.title,
      description: input.description,
      userId: ctx.session.user.id,
      slug: !existing ? slug : null,
      studySets: input.setId
        ? {
            create: {
              studySet: {
                connect: {
                  id: input.setId,
                },
              },
            },
          }
        : {},
      containers: {
        create: {
          userId: ctx.session.user.id,
          viewedAt: new Date(),
          type: "Folder",
        },
      },
    },
  });
};

export default createHandler;
