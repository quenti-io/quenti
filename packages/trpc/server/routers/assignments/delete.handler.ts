import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteAssignmentSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteAssignmentSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  await ctx.prisma.assignment.delete({
    where: {
      id_classId: { ...input },
    },
  });
};

export default deleteHandler;
