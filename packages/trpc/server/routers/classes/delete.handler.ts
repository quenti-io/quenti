import { deleteObjectAssets } from "@quenti/images/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: NonNullableUserContext;
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  await isClassTeacherOrThrow(input.id, ctx.session.user.id, "mutation");

  // If we delete a class, study sets with visibility "Class" could be left without
  // anyone having access to them whatsoever—set the visibility to "Unlisted" instead
  await ctx.prisma.studySet.updateMany({
    where: {
      AND: [
        { visibility: "Class" },
        {
          classesWithAccess: {
            every: {
              classId: input.id,
            },
          },
        },
      ],
    },
    data: {
      visibility: "Unlisted",
    },
  });

  await ctx.prisma.class.delete({
    where: {
      id: input.id,
    },
  });

  await deleteObjectAssets("class", input.id);
};

export default deleteHandler;
