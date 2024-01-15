import { Prisma } from "@prisma/client";
import { generateJSON } from "@tiptap/html";

import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import { SERIALIZABLE_EXTENSIONS } from "./common/editor";
import type { TEditSchema } from "./edit.schema";

type EditOptions = {
  ctx: NonNullableUserContext;
  input: TEditSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const assignment = await ctx.prisma.assignment.findUnique({
    where: {
      id_classId: {
        id: input.id,
        classId: input.classId,
      },
      ...(input.sectionId
        ? {
            class: {
              sections: {
                some: {
                  id: input.sectionId,
                },
              },
            },
          }
        : {}),
    },
    select: {
      sectionId: true,
    },
  });

  if (!assignment) throw new TRPCError({ code: "NOT_FOUND" });

  if (assignment.sectionId !== input.sectionId) {
    // Assignment switched sections, delete all submissions
    await ctx.prisma.submission.deleteMany({
      where: {
        assignmentId: input.id,
      },
    });
  }

  const json = input.description
    ? generateJSON(input.description, SERIALIZABLE_EXTENSIONS)
    : Prisma.JsonNull;

  await ctx.prisma.assignment.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      description: json,
      availableAt: input.availableAt,
      dueAt: input.dueAt,
      lockedAt: input.lockedAt,
      ...(input.sectionId ? { sectionId: input.sectionId } : {}),
    },
  });
};

export default editHandler;
