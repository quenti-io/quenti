import { TRPCError } from "@trpc/server";

import type { NonNullableUserContext } from "../../lib/types";
import type { TSetAllowedClassesSchema } from "./set-allowed-classes.schema";

type SetAllowedClassesOptions = {
  ctx: NonNullableUserContext;
  input: TSetAllowedClassesSchema;
};

export const setAllowedClassesHandler = async ({
  ctx,
  input,
}: SetAllowedClassesOptions) => {
  const studySet = await ctx.prisma.studySet.findUnique({
    where: {
      id_userId: {
        id: input.studySetId,
        userId: ctx.session.user.id,
      },
    },
  });

  if (!studySet) throw new TRPCError({ code: "NOT_FOUND" });

  const classes = await ctx.prisma.class.findMany({
    where: {
      id: {
        in: input.classIds,
      },
      members: {
        some: {
          type: "Teacher",
          userId: ctx.session.user.id,
          deletedAt: null,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!classes.length)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Must specify at least one class",
    });

  await ctx.prisma.studySet.update({
    where: {
      id: input.studySetId,
    },
    data: {
      classesWithAccess: {
        deleteMany: {},
        createMany: {
          data: classes.map((c) => ({ classId: c.id })),
        },
      },
    },
  });
};

export default setAllowedClassesHandler;
