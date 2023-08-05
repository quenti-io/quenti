import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TUpdateStudentsSchema } from "./update-students.schema";

type UpdateStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TUpdateStudentsSchema;
};

export const updateStudentsHandler = async ({
  ctx,
  input,
}: UpdateStudentsOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  await ctx.prisma.classMembership.updateMany({
    where: {
      classId: input.classId,
      type: "Student",
      id: {
        in: input.users,
      },
    },
    data: {
      sectionId: input.sectionId,
    },
  });
};

export default updateStudentsHandler;
