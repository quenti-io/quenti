import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateAssignmentSchema } from "./create.schema";

type CreateOptions = {
  ctx: NonNullableUserContext;
  input: TCreateAssignmentSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  return await ctx.prisma.assignment.create({
    data: input,
  });
};

export default createHandler;
