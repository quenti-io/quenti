import { generateJSON } from "@tiptap/html";

import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import { SERIALIZABLE_EXTENSIONS } from "./common/editor";
import type { TCreateAssignmentSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateAssignmentSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const json = input.description
    ? generateJSON(input.description, SERIALIZABLE_EXTENSIONS)
    : undefined;

  const section = await ctx.prisma.section.findUnique({
    where: {
      id: input.sectionId,
      classId: input.classId,
    },
    select: {
      id: true,
    },
  });

  if (!section) throw new TRPCError({ code: "NOT_FOUND" });

  return await ctx.prisma.assignment.create({
    data: {
      classId: input.classId,
      sectionId: section.id,
      type: input.type,
      title: input.title.slice(0, 255),
      description: json,
      availableAt: input.availableAt,
      dueAt: input.dueAt,
      lockedAt: input.lockedAt,
    },
  });
};

export default createHandler;
