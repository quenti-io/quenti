import { TRPCError } from "@trpc/server";

import { MAX_DESC, MAX_TITLE } from "../../common/constants";
import { profanity } from "../../common/profanity";
import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TCreateCollaborativeSchema } from "./create-collaborative.schema";

type CreateCollaborativeOptions = {
  ctx: NonNullableUserContext;
  input: TCreateCollaborativeSchema;
};

export const createCollaborativeHandler = async ({
  ctx,
  input,
}: CreateCollaborativeOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const assignment = await ctx.prisma.assignment.findUnique({
    where: {
      id: input.assignmentId,
      classId: input.classId,
    },
    select: {
      id: true,
    },
  });

  if (!assignment)
    throw new TRPCError({
      code: "NOT_FOUND",
    });

  if (input.visibility == "Private") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot create a private collab set",
    });
  }

  const set = await ctx.prisma.studySet.create({
    data: {
      type: "Collab",
      userId: ctx.session.user.id,
      assignmentId: assignment.id,
      created: true,
      createdAt: new Date(),
      title: profanity.censor(input.title.slice(0, MAX_TITLE)),
      description: profanity.censor(
        (input.description || "").slice(0, MAX_DESC),
      ),
      wordLanguage: input.wordLanguage,
      definitionLanguage: input.definitionLanguage,
      visibility: input.visibility,
      cortexStale: false,
      collab: {
        create: {
          type: "Default",
          minTermsPerUser: 3,
          maxTermsPerUser: 7,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (input.visibility == "Class") {
    const classes = await ctx.prisma.class.findMany({
      where: {
        ...(input.classesWithAccess
          ? {
              id: {
                in: input.classesWithAccess,
              },
            }
          : {}),
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

    await ctx.prisma.allowedClassesOnStudySets.createMany({
      data: classes.map((c) => ({
        classId: c.id,
        studySetId: set.id,
      })),
    });
  }
};

export default createCollaborativeHandler;
