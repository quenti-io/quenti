import { Prisma } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUpdateSectionSchema } from "./update-section.schema";

type UpdateSectionOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateSectionSchema;
};

export const updateSectionHandler = async ({
  ctx,
  input,
}: UpdateSectionOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  try {
    await ctx.prisma.section.update({
      where: {
        classId: input.classId,
        id: input.sectionId,
      },
      data: {
        name: input.name,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code == "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "section_already_exists",
        });
      }
    } else throw e;
  }
};

export default updateSectionHandler;
