import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TGetAllowedClassesSchema } from "./get-allowed-classes.schema";

type GetAllowedClassesOptions = {
  ctx: NonNullableUserContext;
  input: TGetAllowedClassesSchema;
};

export const getAllowedClassesHandler = async ({
  ctx,
  input,
}: GetAllowedClassesOptions) => {
  try {
    await ctx.prisma.studySet.findUniqueOrThrow({
      where: {
        id_userId: {
          id: input.studySetId,
          userId: ctx.session.user.id,
        },
      },
      select: {
        id: true,
      },
    });
  } catch {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const allowed = await ctx.prisma.allowedClassesOnStudySets.findMany({
    where: {
      studySetId: input.studySetId,
    },
    select: {
      classId: true,
    },
  });

  return { classes: allowed.map((c) => c.classId) };
};

export default getAllowedClassesHandler;
