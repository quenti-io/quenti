import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TEditSchema } from "./edit.schema";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
  if (
    (await ctx.prisma.studySet.findUnique({
      where: {
        id_userId: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        created: true,
      },
    })) &&
    input.title.length < 1
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Set title is required.",
    });
  }

  if (input.visibility == "Class") {
    if (ctx.session.user.type != "Teacher")
      throw new TRPCError({
        code: "BAD_REQUEST",
      });

    const existing = await ctx.prisma.allowedClassesOnStudySets.findFirst({
      where: {
        studySetId: input.id,
      },
      select: {
        classId: true,
      },
    });

    if (!existing) {
      const firstTeacherClass = await ctx.prisma.classMembership.findFirst({
        where: {
          userId: ctx.session.user.id,
          type: "Teacher",
          deletedAt: null,
        },
        select: {
          class: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!firstTeacherClass)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No classes found",
        });

      await ctx.prisma.allowedClassesOnStudySets.create({
        data: {
          classId: firstTeacherClass.class.id,
          studySetId: input.id,
        },
      });
    }
  }

  const studySet = await ctx.prisma.studySet.update({
    where: {
      id_userId: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    },
    data: {
      title: input.title,
      description: input.description,
      tags: input.tags,
      wordLanguage: input.wordLanguage,
      definitionLanguage: input.definitionLanguage,
      visibility: input.visibility,
    },
  });

  return studySet;
};

export default editHandler;
