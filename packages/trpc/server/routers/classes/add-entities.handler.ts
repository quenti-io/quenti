import { TRPCError } from "@trpc/server";

import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddEntitiesSchema } from "./add-entities.schema";

type AddEntitiesOptions = {
  ctx: NonNullableUserContext;
  input: TAddEntitiesSchema;
};

export const addEntitiesHandler = async ({
  ctx,
  input,
}: AddEntitiesOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  const class_ = (await ctx.prisma.class.findUnique({
    where: {
      id: input.classId,
    },
    include: {
      studySets: {
        select: {
          studySetId: true,
        },
      },
      folders: {
        select: {
          folderId: true,
        },
      },
    },
  }))!;

  if (input.type == "Folder") {
    const folders = await ctx.prisma.folder.findMany({
      where: {
        id: {
          in: input.entities,
          notIn: class_.folders.map((x) => x.folderId),
        },
      },
      select: {
        id: true,
      },
    });

    await ctx.prisma.foldersOnClasses.createMany({
      data: folders.map((f) => ({
        classId: input.classId,
        folderId: f.id,
      })),
    });
  } else {
    const studySets = await ctx.prisma.studySet.findMany({
      where: {
        id: {
          in: input.entities,
          notIn: class_.studySets.map((x) => x.studySetId),
        },
      },
      select: {
        id: true,
        userId: true,
        created: true,
        visibility: true,
      },
    });

    if (studySets.find((x) => !x.created)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot add drafts to a class",
      });
    }
    if (
      studySets.find(
        (x) => x.visibility == "Private" && x.userId !== ctx.session.user.id,
      )
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot add other users' private study sets to a class",
      });
    }

    await ctx.prisma.studySetsOnClasses.createMany({
      data: studySets.map((s) => ({
        classId: input.classId,
        studySetId: s.id,
      })),
    });
  }
};

export default addEntitiesHandler;
