import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSectionSchema } from "./delete-section.schema";

type DeleteSectionOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSectionSchema;
};

export const deleteSectionHandler = async ({
  ctx,
  input,
}: DeleteSectionOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const section = await ctx.prisma.section.findFirst({
    where: {
      id: input.sectionId,
      classId: input.classId,
    },
  });
  if (!section) throw new TRPCError({ code: "NOT_FOUND" });

  await ctx.prisma.section.delete({
    where: {
      id: input.sectionId,
    },
  });
};

export default deleteSectionHandler;
