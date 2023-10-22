import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateSectionSchema } from "./create-section.schema";

type CreateSectionOptions = {
  ctx: NonNullableUserContext;
  input: TCreateSectionSchema;
};

export const createSectionHandler = async ({
  ctx,
  input,
}: CreateSectionOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const sections = await ctx.prisma.section.findMany({
    where: {
      classId: input.classId,
    },
    select: {
      name: true,
    },
  });

  if (sections.length >= 10)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You can only have up to 10 sections per class",
    });

  if (sections.map((s) => s.name).includes(input.name)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "section_already_exists",
    });
  }

  return await ctx.prisma.section.create({
    data: {
      classId: input.classId,
      name: input.name,
    },
  });
};

export default createSectionHandler;
