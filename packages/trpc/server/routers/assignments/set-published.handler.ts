import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TSetPublishedSchema } from "./set-published.schema";

type SetPublishedOptions = {
  ctx: NonNullableUserContext;
  input: TSetPublishedSchema;
};

export const setPublishedHandler = async ({
  ctx,
  input,
}: SetPublishedOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  await ctx.prisma.assignment.update({
    where: {
      id_classId: {
        id: input.id,
        classId: input.classId,
      },
    },
    data: {
      published: input.published,
    },
  });
};

export default setPublishedHandler;
