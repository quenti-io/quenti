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
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  if (
    await ctx.prisma.section.findUnique({
      where: {
        classId_name: {
          classId: input.classId,
          name: input.name,
        },
      },
    })
  ) {
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
